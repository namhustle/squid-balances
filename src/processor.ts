import {assertNotNull} from '@subsquid/util-internal'
import {
    BlockHeader,
    DataHandlerContext,
    SubstrateBatchProcessor,
    SubstrateBatchProcessorFields,
    Event as _Event,
    Call as _Call,
    Extrinsic as _Extrinsic
} from '@subsquid/substrate-processor'
import {ApiPromise, WsProvider} from '@polkadot/api'
import {events} from './types'

async function getLatestBlock(): Promise<number> {
    const provider = new WsProvider(assertNotNull(process.env.RPC_KUSAMA_WS, 'No WS endpoint supplied'))
    const api = await ApiPromise.create({provider})
    const header = await api.rpc.chain.getHeader()
    await api.disconnect()
    return header.number.toNumber()
}

export async function createProcessor(blockCount: number = 1000) {
    const latest = await getLatestBlock()
    const from = Math.max(0, latest - blockCount)
    const to = latest

    console.log(`⚡ Indexing last ${blockCount} blocks: ${from} → ${to}`)

    return new SubstrateBatchProcessor()
        .setGateway('https://v2.archive.subsquid.io/network/kusama')
        .setRpcEndpoint({
            url: assertNotNull(process.env.RPC_KUSAMA_HTTP, 'No RPC endpoint supplied'),
            rateLimit: 10
        })
        .addEvent({
            name: [events.balances.transfer.name],
            extrinsic: true
        })
        .setFields({
            event: { args: true },
            extrinsic: { hash: true, fee: true },
            block: { timestamp: true }
        })
        .setBlockRange({ from, to })
}

export type Fields = SubstrateBatchProcessorFields<Awaited<ReturnType<typeof createProcessor>>>
export type Block = BlockHeader<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
