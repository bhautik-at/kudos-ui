# Team Member Invitation Test Cases

## Feature Overview
```gherkin
Feature: Team Member Invitation
  As a Tech Lead
  I want to invite team members
  So that they can join the team and access the system
```

## Test Scenarios

### Basic Functionality

#### TC-1: Open Invitation Modal
```gherkin
Background:
  Given I am logged in as a Tech Lead
  And I am on the User Management page

Scenario: Open invitation modal
  When I click on "Invite Team Members" button
  Then I should see the invitation modal
  And the modal should have an email input field
  And the modal should have "Send Invitation" and "Cancel" buttons
```

#### TC-2: Cancel Invitation Process
```gherkin
Scenario: Cancel invitation process
  Given I am on the invitation modal
  When I click on "Cancel" button
  Then the modal should close
  And I should remain on the User Management page
```

#### TC-3: Send Single Invitation
```gherkin
Scenario: Send invitation to single team member
  Given I am on the invitation modal
  When I enter "team.member@example.com" in the email field
  And I click on "Send Invitation" button
  Then I should see a success message "Invitation sent successfully"
  And the modal should close
  And an invitation email should be sent to "team.member@example.com"
```

#### TC-4: Send Multiple Invitations
```gherkin
Scenario: Send invitation to multiple team members
  Given I am on the invitation modal
  When I enter multiple email addresses:
    | email1@example.com |
    | email2@example.com |
    | email3@example.com |
  And I click on "Send Invitation" button
  Then I should see a success message "Invitations sent successfully"
  And the modal should close
  And invitation emails should be sent to all entered email addresses
```

### Validation Cases

#### TC-5: Invalid Email Format
```gherkin
Scenario: Attempt to send invitation with invalid email
  Given I am on the invitation modal
  When I enter "invalid-email" in the email field
  And I click on "Send Invitation" button
  Then I should see an error message "Please enter valid email addresses"
  And the modal should remain open
```

#### TC-6: Empty Email Field
```gherkin
Scenario: Attempt to send invitation with empty email field
  Given I am on the invitation modal
  When I leave the email field empty
  And I click on "Send Invitation" button
  Then I should see an error message "Email field cannot be empty"
  And the modal should remain open
```

#### TC-7: Already Registered User
```gherkin
Scenario: Attempt to invite already registered team member
  Given I am on the invitation modal
  When I enter "existing.user@example.com" in the email field
  And I click on "Send Invitation" button
  Then I should see an error message "User is already registered"
  And the modal should remain open
```

#### TC-8: Duplicate Email Addresses
```gherkin
Scenario: Attempt to invite team member with duplicate email
  Given I am on the invitation modal
  When I enter multiple email addresses:
    | team.member@example.com |
    | team.member@example.com |
  And I click on "Send Invitation" button
  Then I should see an error message "Duplicate email addresses are not allowed"
  And the modal should remain open
```

#### TC-9: Maximum Invitation Limit
```gherkin
Scenario: Attempt to invite team member with maximum email limit exceeded
  Given I am on the invitation modal
  When I enter more than 10 email addresses
  And I click on "Send Invitation" button
  Then I should see an error message "Maximum 10 invitations can be sent at once"
  And the modal should remain open
```

### Invitation Management

#### TC-10: Invitation Link Expiration
```gherkin
Scenario: Verify invitation link expiration
  Given I am on the invitation modal
  When I enter "team.member@example.com" in the email field
  And I click on "Send Invitation" button
  Then an invitation email should be sent to "team.member@example.com"
  And the invitation link should expire after 24 hours
```

#### TC-11: Resend Pending Invitation
```gherkin
Scenario: Resend invitation to pending team member
  Given I am on the User Management page
  And there is a pending invitation for "pending.member@example.com"
  When I click on "Resend Invitation" for "pending.member@example.com"
  Then I should see a success message "Invitation resent successfully"
  And a new invitation email should be sent to "pending.member@example.com"
```

#### TC-12: Cancel Pending Invitation
```gherkin
Scenario: Cancel pending invitation
  Given I am on the User Management page
  And there is a pending invitation for "pending.member@example.com"
  When I click on "Cancel Invitation" for "pending.member@example.com"
  Then I should see a confirmation dialog
  When I confirm the cancellation
  Then I should see a success message "Invitation cancelled successfully"
  And the invitation should be removed from pending invitations
```

#### TC-13: Invitation Tracking
```gherkin
Scenario: Verify invitation tracking
  Given I am on the User Management page
  When I send invitations to multiple team members
  Then I should see the invitation status as "Pending"
  And I should see the invitation sent date and time
  And I should see the number of times invitation was sent
```

### Error Handling

#### TC-14: Network Error
```gherkin
Scenario: Handle network error during invitation
  Given I am on the invitation modal
  When I enter "team.member@example.com" in the email field
  And there is a network error
  And I click on "Send Invitation" button
  Then I should see an error message "Failed to send invitation. Please try again"
  And the modal should remain open
  And the invitation should not be sent
```

### Email Content Verification

#### TC-15: Invitation Email Content
```gherkin
Scenario: Verify invitation email content
  Given I am on the invitation modal
  When I enter "team.member@example.com" in the email field
  And I click on "Send Invitation" button
  Then an invitation email should be sent to "team.member@example.com"
  And the email should contain a valid invitation link
  And the email should contain team name and Tech Lead's name
``` 