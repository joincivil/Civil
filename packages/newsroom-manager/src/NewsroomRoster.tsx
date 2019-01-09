{/* <FormSection>
<FormTitle>Newsroom Roster</FormTitle>
<p>
  Select the participants in your WordPress newsroom you want to add your roster and include any relevant
  credentials.
</p>
{(charter.roster || []).map((member, i) => {
  const contractUser = find(contractUsers, user => user.rosterData.ethAddress === member.ethAddress);
  return (
    <RosterMember
      newsroomAddress={this.props.address!}
      key={i}
      user={{
        rosterData: member,
        isCmsUser: contractUser && contractUser.isCmsUser,
        username: contractUser && contractUser.username,
      }}
      onContract={!!contractUser}
      updateRosterMember={this.rosterMemberUpdate}
    />
  );
})}
<AddRosterMember href="#" onClick={this.addRosterMember}>
  Add Additional Roster Member
</AddRosterMember>
</FormSection>


private addRosterMember = (e: any) => {
  e.preventDefault();
  const newMember = {};
  this.props.updateCharter({
    ...this.props.charter,
    roster: (this.props.charter.roster || []).concat(newMember as RosterMemberInterface),
  });
};

private rosterMemberUpdate = (
  oldVal: Partial<RosterMemberInterface>,
  newVal: Partial<RosterMemberInterface>,
  deleteMember?: boolean,
) => {
  const roster = (this.props.charter.roster || []).slice();

  if (
    newVal.ethAddress &&
    oldVal.ethAddress !== newVal.ethAddress &&
    find(roster, rosterMember => rosterMember.ethAddress === newVal.ethAddress)
  ) {
    // Address being updated to an address already on roster, an edge-case that would put UI in a weird state, a pain to handle, so just alert for now and don't apply change.
    alert('Wallet address "' + newVal.ethAddress + '" already exists your newsroom roster.');
    return;
  }

  const key = oldVal.ethAddress ? "ethAddress" : "name";
  const memberIndex = findIndex(roster, rosterMember => rosterMember[key] === oldVal[key]);

  if (deleteMember) {
    roster.splice(memberIndex, 1);
  } else {
    roster[memberIndex] = newVal as RosterMemberInterface;
  }

  this.props.updateCharter({
    ...this.props.charter,
    roster,
  });
}; */}
