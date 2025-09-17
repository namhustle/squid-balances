import {TypeormDatabase} from '@subsquid/typeorm-store'
import {createProcessor} from './processor'
import {events, storage} from './types'
import * as ss58 from '@subsquid/ss58'
import {Account, Transfer} from "./model"

async function main() {
    const processor = await createProcessor(1000)
    processor.run(new TypeormDatabase(), async (ctx) => {
        for (let block of ctx.blocks) {
            for (let event of block.events) {
                if (event.name === 'Balances.Transfer') {
                    try {
                        // Decode transfer event
                        let decoded: any
                        if (block.header.specVersion >= 9130) {
                            decoded = events.balances.transfer.v9130.decode(event)
                        } else if (block.header.specVersion >= 1050) {
                            decoded = events.balances.transfer.v1050.decode(event)
                        } else {
                            decoded = events.balances.transfer.v1020.decode(event)
                        }

                        // Extract from/to addresses
                        let fromPublicKey: Uint8Array, toPublicKey: Uint8Array
                        if (block.header.specVersion >= 9130) {
                            fromPublicKey = decoded.from
                            toPublicKey = decoded.to
                        } else {
                            fromPublicKey = decoded[0]
                            toPublicKey = decoded[1]
                        }

                        // Encode addresses to KSM format
                        const fromKSMAddress = ss58.codec('kusama').encode(fromPublicKey)
                        const toKSMAddress = ss58.codec('kusama').encode(toPublicKey)

                        // Query account balances (handle multiple spec versions)
                        let fromBalance: any, toBalance: any
                        if (storage.system.account.v9420.is(block.header)) {
                            fromBalance = await storage.system.account.v9420.get(block.header, fromPublicKey.toString())
                            toBalance = await storage.system.account.v9420.get(block.header, toPublicKey.toString())
                        } else if (storage.system.account.v2030.is(block.header)) {
                            fromBalance = await storage.system.account.v2030.get(block.header, fromPublicKey.toString())
                            toBalance = await storage.system.account.v2030.get(block.header, toPublicKey.toString())
                        } else if (storage.system.account.v2028.is(block.header)) {
                            fromBalance = await storage.system.account.v2028.get(block.header, fromPublicKey.toString())
                            toBalance = await storage.system.account.v2028.get(block.header, toPublicKey.toString())
                        } else if (storage.system.account.v1050.is(block.header)) {
                            fromBalance = await storage.system.account.v1050.get(block.header, fromPublicKey.toString())
                            toBalance = await storage.system.account.v1050.get(block.header, toPublicKey.toString())
                        } else {
                            console.log(`⚠️ No storage version for spec ${block.header.specVersion}`)
                        }

                        // Upsert accounts to DB
                        if (fromBalance?.data) {
                            await ctx.store.upsert(new Account({
                                id: fromPublicKey.toString(),
                                address: fromKSMAddress,
                                free: fromBalance.data.free || 0n,
                                reserved: fromBalance.data.reserved || 0n,
                                frozen: fromBalance.data.frozen || 0n,
                            }))
                        }
                        if (toBalance?.data) {
                            await ctx.store.upsert(new Account({
                                id: toPublicKey.toString(),
                                address: toKSMAddress,
                                free: toBalance.data.free || 0n,
                                reserved: toBalance.data.reserved || 0n,
                                frozen: toBalance.data.frozen || 0n,
                            }))
                        }

                        // Upsert transfers to DB
                        if (fromBalance && toBalance) {
                            await ctx.store.upsert(new Transfer({
                                id: event.id,
                                blockHash: block.header.hash.toString(),
                                from: new Account({ id: fromPublicKey.toString() }),
                                to: new Account({ id: toPublicKey.toString() }),
                                amount: decoded.amount,
                                fee: event.extrinsic?.fee,
                            }))
                        }
                    } catch (error) {
                        console.error('❌ Error processing transfer:', error)
                    }
                }
            }
        }
    })
}

main().catch(err => {
    console.error('❌ Fatal error:', err)
    process.exit(1)
})
