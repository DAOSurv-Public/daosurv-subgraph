import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import {
  NounsDAOProxy,
  NewAdmin,
  NewImplementation,
  NewPendingAdmin,
  NewVetoer,
  ProposalCanceled,
  ProposalCreated,
  ProposalCreatedWithRequirements,
  ProposalExecuted,
  ProposalQueued,
  ProposalThresholdBPSSet,
  ProposalVetoed,
  QuorumVotesBPSSet,
  VoteCast,
  VotingDelaySet,
  VotingPeriodSet,
} from "../generated/NounsDAOProxy/NounsDAOProxy";
import { Proposal } from "../generated/schema";

export function handleNewAdmin(event: NewAdmin): void {}

export function handleNewImplementation(event: NewImplementation): void {}

export function handleNewPendingAdmin(event: NewPendingAdmin): void {}

export function handleNewVetoer(event: NewVetoer): void {}

export function handleProposalCanceled(event: ProposalCanceled): void {
  let entity = Proposal.load(event.params.id.toString());

  if (entity) {
    entity.canceled = true;
    entity.save();
  }
}

export function handleProposalCreated(event: ProposalCreated): void {}

export function handleProposalCreatedWithRequirements(
  event: ProposalCreatedWithRequirements
): void {
  let entity = new Proposal("noun_" + event.params.id.toString());

  // get bytes array
  const targets = new Array<Bytes>();
  for (let i = 0; i < event.params.targets.length; i++) {
    targets.push(event.params.targets[i]);
  }

  entity.governor = event.address;
  entity.proposalId = event.params.id;
  entity.proposer = event.params.proposer;
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
  entity.description = event.params.description;
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

export function handleProposalThresholdBPSSet(
  event: ProposalThresholdBPSSet
): void {}

export function handleProposalVetoed(event: ProposalVetoed): void {
  let entity = Proposal.load(event.params.id.toString());

  if (entity) {
    entity.vetoed = true;
    entity.save();
  }
}

export function handleQuorumVotesBPSSet(event: QuorumVotesBPSSet): void {}

export function handleVoteCast(event: VoteCast): void {
  let entity = Proposal.load(event.params.proposalId.toString());

  if (entity) {
    const support = event.params.support;
    const votes = event.params.votes;
    if (support == 0) {
      entity.againstVotes = entity.againstVotes.plus(votes);
    } else if (support == 1) {
      entity.forVotes = entity.forVotes.plus(votes);
    } else if (support == 2) {
      entity.abstainVotes = entity.abstainVotes.plus(votes);
    }
    entity.save();
  }
}

export function handleVotingDelaySet(event: VotingDelaySet): void {}

export function handleVotingPeriodSet(event: VotingPeriodSet): void {}
