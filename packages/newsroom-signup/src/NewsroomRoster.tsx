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




 */}
