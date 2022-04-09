import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";

export function addressToString(targets: Address[]): string[] {
  const addresses: string[] = [];
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i].toString();
    addresses.push(target);
  }
  return addresses;
}
