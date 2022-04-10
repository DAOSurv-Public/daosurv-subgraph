import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  AaveGovernorV2,
  ExecutorAuthorized,
  ExecutorUnauthorized,
  GovernanceStrategyChanged,
  OwnershipTransferred,
  ProposalCanceled,
  ProposalCreated,
  ProposalExecuted,
  ProposalQueued,
  VoteEmitted,
  VotingDelayChanged,
} from "../generated/AaveGovernorV2/AaveGovernorV2";
import { Proposal } from "../generated/schema";

export function handleExecutorAuthorized(event: ExecutorAuthorized): void {}

export function handleExecutorUnauthorized(event: ExecutorUnauthorized): void {}

export function handleGovernanceStrategyChanged(
  event: GovernanceStrategyChanged
): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleProposalCanceled(event: ProposalCanceled): void {
  let entity = Proposal.load(event.params.id.toString());

  if (entity) {
    entity.canceled = true;
    entity.save();
  }
}

export function handleProposalCreated(event: ProposalCreated): void {
  let entity = new Proposal("aave_" + event.params.id.toString());

  // get bytes array
  const targets = new Array<Bytes>();
  for (let i = 0; i < event.params.targets.length; i++) {
    targets.push(event.params.targets[i]);
  }

  let hash = Bytes.fromHexString(
    "1220" + event.params.ipfsHash.toHexString().slice(2)
  ).toBase58();

  entity.governor = event.address;
  entity.proposalId = event.params.id;
  entity.proposer = event.params.creator;
  entity.targets = targets;
  entity.signatures = event.params.signatures;
  entity.calldatas = event.params.calldatas;
  entity.startBlock = event.params.startBlock;
  entity.endBlock = event.params.endBlock;
  entity.forVotes = BigInt.fromI32(0);
  entity.againstVotes = BigInt.fromI32(0);
  entity.abstainVotes = BigInt.fromI32(0);
  entity.canceled = false;
  entity.queued = false;
  entity.executed = false;
  entity.vetoed = false;
  entity.ipfsHash = hash;
  entity.save();
}

export function handleProposalExecuted(event: ProposalExecuted): void {
  let entity = Proposal.load(event.params.id.toString());

  if (entity) {
    entity.executed = true;
    entity.save();
  }
}

export function handleProposalQueued(event: ProposalQueued): void {
  let entity = Proposal.load(event.params.id.toString());

  if (entity) {
    entity.queued = true;
    entity.save();
  }
}

export function handleVoteEmitted(event: VoteEmitted): void {
  let entity = Proposal.load(event.params.id.toString());

  if (entity) {
    const support = event.params.support;
    const votes = event.params.votingPower;
    if (!support) {
      entity.againstVotes = entity.againstVotes.plus(votes);
    } else {
      entity.forVotes = entity.forVotes.plus(votes);
    }
    entity.save();
  }
}

export function handleVotingDelayChanged(event: VotingDelayChanged): void {}
