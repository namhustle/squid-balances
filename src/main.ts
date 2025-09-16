import {TypeormDatabase} from '@subsquid/typeorm-store'
import {processor} from './processor'
import {Account} from './model'
import {events, storage} from './types'
import * as ss58 from '@subsquid/ss58'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    const accounts = new Map<string, Account>()

    console.log(`Processing ${ctx.blocks.length} blocks`)

    for (let block of ctx.blocks) {
        console.log(`Block ${block.header.height}: ${block.events.length} events`)

        for (let event of block.events) {
            if (event.name === events.balances.transfer.name) {
                // Decode transfer event
                const rec = events.balances.transfer.v9130.decode(event)
                
                const from = rec.from
                const to = rec.to
                const fromId = ss58.codec('kusama').encode(from)
                const toId = ss58.codec('kusama').encode(to)

                // Get actual balances from storage
                const fromBalance = await storage.system.account.v2030.get(block.header, from)
                const toBalance = await storage.system.account.v2030.get(block.header, to)

                // Update from account
                let fromAccount = accounts.get(fromId) || new Account({
                    id: fromId,
                    free: fromBalance?.data.free || 0n,
                    reserved: fromBalance?.data.reserved || 0n,
                    total: (fromBalance?.data.free || 0n) + (fromBalance?.data.reserved || 0n),
                    updatedAt: BigInt(block.header.timestamp!)
                })
                accounts.set(fromId, fromAccount)

                // Update to account
                let toAccount = accounts.get(toId) || new Account({
                    id: toId,
                    free: toBalance?.data.free || 0n,
                    reserved: toBalance?.data.reserved || 0n,
                    total: (toBalance?.data.free || 0n) + (toBalance?.data.reserved || 0n),
                    updatedAt: BigInt(block.header.timestamp!)
                })
                accounts.set(toId, toAccount)
            }
        }
    }
    console.log(`Upserting ${accounts.size} accounts`)
    console.log(accounts.values())
    await ctx.store.upsert([...accounts.values()])
})