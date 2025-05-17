/**
 * Data transfer object for the response of accepting a user invitation
 */
export interface AcceptInvitationOutputDto {
  success: boolean;
  message: string;
  organizationId: string;
}
