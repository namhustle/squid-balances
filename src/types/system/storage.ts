import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v1050 from '../v1050'
import * as v2028 from '../v2028'
import * as v2030 from '../v2030'
import * as v9420 from '../v9420'

export const account =  {
    /**
     *  The full account information for a particular account ID.
     */
    v1050: new StorageType('System.Account', 'Default', [v1050.AccountId], v1050.AccountInfo) as AccountV1050,
    /**
     *  The full account information for a particular account ID.
     */
    v2028: new StorageType('System.Account', 'Default', [v2028.AccountId], v2028.AccountInfo) as AccountV2028,
    /**
     *  The full account information for a particular account ID.
     */
    v2030: new StorageType('System.Account', 'Default', [v2030.AccountId], v2030.AccountInfo) as AccountV2030,
    /**
     *  The full account information for a particular account ID.
     */
    v9420: new StorageType('System.Account', 'Default', [v9420.AccountId32], v9420.AccountInfo) as AccountV9420,
}

/**
 *  The full account information for a particular account ID.
 */
export interface AccountV1050  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v1050.AccountInfo
    get(block: Block, key: v1050.AccountId): Promise<(v1050.AccountInfo | undefined)>
    getMany(block: Block, keys: v1050.AccountId[]): Promise<(v1050.AccountInfo | undefined)[]>
}

/**
 *  The full account information for a particular account ID.
 */
export interface AccountV2028  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v2028.AccountInfo
    get(block: Block, key: v2028.AccountId): Promise<(v2028.AccountInfo | undefined)>
    getMany(block: Block, keys: v2028.AccountId[]): Promise<(v2028.AccountInfo | undefined)[]>
    getKeys(block: Block): Promise<v2028.AccountId[]>
    getKeys(block: Block, key: v2028.AccountId): Promise<v2028.AccountId[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v2028.AccountId[]>
    getKeysPaged(pageSize: number, block: Block, key: v2028.AccountId): AsyncIterable<v2028.AccountId[]>
    getPairs(block: Block): Promise<[k: v2028.AccountId, v: (v2028.AccountInfo | undefined)][]>
    getPairs(block: Block, key: v2028.AccountId): Promise<[k: v2028.AccountId, v: (v2028.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v2028.AccountId, v: (v2028.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v2028.AccountId): AsyncIterable<[k: v2028.AccountId, v: (v2028.AccountInfo | undefined)][]>
}

/**
 *  The full account information for a particular account ID.
 */
export interface AccountV2030  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v2030.AccountInfo
    get(block: Block, key: v2030.AccountId): Promise<(v2030.AccountInfo | undefined)>
    getMany(block: Block, keys: v2030.AccountId[]): Promise<(v2030.AccountInfo | undefined)[]>
    getKeys(block: Block): Promise<v2030.AccountId[]>
    getKeys(block: Block, key: v2030.AccountId): Promise<v2030.AccountId[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v2030.AccountId[]>
    getKeysPaged(pageSize: number, block: Block, key: v2030.AccountId): AsyncIterable<v2030.AccountId[]>
    getPairs(block: Block): Promise<[k: v2030.AccountId, v: (v2030.AccountInfo | undefined)][]>
    getPairs(block: Block, key: v2030.AccountId): Promise<[k: v2030.AccountId, v: (v2030.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v2030.AccountId, v: (v2030.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v2030.AccountId): AsyncIterable<[k: v2030.AccountId, v: (v2030.AccountInfo | undefined)][]>
}

/**
 *  The full account information for a particular account ID.
 */
export interface AccountV9420  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v9420.AccountInfo
    get(block: Block, key: v9420.AccountId32): Promise<(v9420.AccountInfo | undefined)>
    getMany(block: Block, keys: v9420.AccountId32[]): Promise<(v9420.AccountInfo | undefined)[]>
    getKeys(block: Block): Promise<v9420.AccountId32[]>
    getKeys(block: Block, key: v9420.AccountId32): Promise<v9420.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v9420.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v9420.AccountId32): AsyncIterable<v9420.AccountId32[]>
    getPairs(block: Block): Promise<[k: v9420.AccountId32, v: (v9420.AccountInfo | undefined)][]>
    getPairs(block: Block, key: v9420.AccountId32): Promise<[k: v9420.AccountId32, v: (v9420.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v9420.AccountId32, v: (v9420.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v9420.AccountId32): AsyncIterable<[k: v9420.AccountId32, v: (v9420.AccountInfo | undefined)][]>
}
