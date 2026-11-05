// Reject sign-in code requests for emails that are not invited. No email is sent.
// (PocketBase otherwise answers with a fake otpId for unknown emails.)
onRecordRequestOTPRequest((e) => {
  if (!e.record) throw new BadRequestError("This email is not a member of the research project.");
  e.next();
}, "users");
