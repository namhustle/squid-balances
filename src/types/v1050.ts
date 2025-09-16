import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface AccountData {
    free: Balance
    reserved: Balance
    miscFrozen: Balance
    feeFrozen: Balance
}

export type Balance = bigint

export const AccountData: sts.Type<AccountData> = sts.struct(() => {
    return  {
        free: Balance,
        reserved: Balance,
        miscFrozen: Balance,
        feeFrozen: Balance,
    }
})

export type AccountId = Bytes

export interface AccountInfo {
    nonce: Index
    refcount: RefCount
    data: AccountData
}

export type RefCount = number

export type Index = number

export const AccountInfo: sts.Type<AccountInfo> = sts.struct(() => {
    return  {
        nonce: Index,
        refcount: RefCount,
        data: AccountData,
    }
})

export const RefCount = sts.number()

export const Index = sts.number()

export const Balance = sts.bigint()

export const AccountId = sts.bytes()
