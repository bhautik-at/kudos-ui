# Authentication Test Cases

## Feature: User Authentication
As a user
I want to authenticate myself
So that I can access the dashboard

## Background
Given I am on the authentication page
And the page title is "Authentication"

## Test Categories

### 1. Form Validation Tests

#### 1.1 Required Field Validation
```gherkin
Scenario: Signup with missing required fields
  Given I am a new user
  When I click the signup button
  Then I should see an error message "First name is required"
  And I should see an error message "Last name is required"
  And I should see an error message "Email is required"
  And I should remain on the authentication page

Scenario: Login with missing email
  Given I am an existing user
  When I click the login button
  Then I should see an error message "Email is required"
  And I should remain on the authentication page
```

#### 1.2 Email Format Validation
```gherkin
Scenario: Signup with invalid email format
  Given I am a new user
  When I enter "John" in the first name field
  And I enter "Doe" in the last name field
  And I enter "invalid-email" in the email field
  And I click the signup button
  Then I should see an error message "Please enter a valid email address"
  And I should remain on the authentication page
```

#### 1.3 Input Format Validation
```gherkin
Scenario: Form field trimming validation
  Given I am a new user
  When I enter "  John  " in the first name field
  And I enter "  Doe  " in the last name field
  And I enter "  john.doe@example.com  " in the email field
  And I click the signup button
  Then the first name should be stored as "John"
  And the last name should be stored as "Doe"
  And the email should be stored as "john.doe@example.com"
  And I should be redirected to the OTP verification page

Scenario: Form field case sensitivity validation
  Given I am a new user
  When I enter "JOHN" in the first name field
  And I enter "DOE" in the last name field
  And I enter "JOHN.DOE@EXAMPLE.COM" in the email field
  And I click the signup button
  Then the first name should be stored as "John"
  And the last name should be stored as "Doe"
  And the email should be stored as "john.doe@example.com"
  And I should be redirected to the OTP verification page

Scenario: Form field special character validation
  Given I am a new user
  When I enter "John-Doe" in the first name field
  And I enter "O'Connor" in the last name field
  And I enter "john.doe@example.com" in the email field
  And I click the signup button
  Then the first name should be stored as "John-Doe"
  And the last name should be stored as "O'Connor"
  And the email should be stored as "john.doe@example.com"
  And I should be redirected to the OTP verification page
```

### 2. Navigation Flow Tests

#### 2.1 Form Navigation
```gherkin
Scenario: Form field tab order validation
  Given I am a new user
  When I press the tab key
  Then the focus should move to the first name field
  When I press the tab key again
  Then the focus should move to the last name field
  When I press the tab key again
  Then the focus should move to the email field
  When I press the tab key again
  Then the focus should move to the signup button
  When I press the tab key again
  Then the focus should move to the login button
  When I press the tab key again
  Then the focus should move back to the first name field

Scenario: Enter key behavior in form fields
  Given I am a new user
  When I enter "John" in the first name field
  And I press Enter key
  Then the focus should move to the last name field
  When I enter "Doe" in the last name field
  And I press Enter key
  Then the focus should move to the email field
  When I enter "john.doe@example.com" in the email field
  And I press Enter key
  Then the signup button should be clicked
  And I should be redirected to the OTP verification page
```

#### 2.2 Browser Navigation
```gherkin
Scenario: Browser back button validation
  Given I am a new user
  When I enter "John" in the first name field
  And I enter "Doe" in the last name field
  And I enter "john.doe@example.com" in the email field
  And I click the signup button
  And I am redirected to the OTP verification page
  When I click the browser back button
  Then I should be redirected to the authentication page
  And the first name field should not be empty
  And the last name field should not be empty
  And the email field should not be empty
  And the first name field should contain "John"
  And the last name field should contain "Doe"
  And the email field should contain "john.doe@example.com"

Scenario: Dashboard back button restriction
  Given I am a logged in user
  And I am on the dashboard page
  When I click the browser back button
  Then I should remain on the dashboard page
  And I should not be redirected to the OTP verification page
  When I click the browser back button again
  Then I should still remain on the dashboard page
  And I should not be redirected to any previous page
```

### 3. OTP Functionality Tests

#### 3.1 OTP Validation
```gherkin
Scenario: OTP verification with valid 4-digit OTP
  Given I am on the OTP verification page
  And I have received an OTP
  When I enter "1234" in the OTP field
  Then the login button should be enabled
  And when I click the login button
  Then I should see a success message in the toaster
  And I should be redirected to the dashboard

Scenario: OTP verification with invalid OTP
  Given I am on the OTP verification page
  And I have received an OTP
  When I enter "1234" in the OTP field
  Then the login button should remain disabled
  And I should see an error message "Invalid OTP"

Scenario: OTP field validation - less than 4 digits
  Given I am on the OTP verification page
  When I enter "123" in the OTP field
  Then I should see an error message "OTP must be 4 digits"
  And the login button should remain disabled

Scenario: OTP field validation - more than 4 digits
  Given I am on the OTP verification page
  When I enter "12345" in the OTP number input field
  Then only the first 4 digits "1234" should be accepted and visible
  And the 5th digit "5" should be ignored
  And no error message should be displayed
  And the login button should become enabled if the 4 digits are valid
```

#### 3.2 OTP Input Restrictions
```gherkin
Scenario: OTP field validation - alphanumeric input blocked
  Given I am on the OTP verification page
  When I try to enter "abc1" in the OTP number input field
  Then only the digit "1" should be accepted
  And the alphabetic characters should be blocked from entry
  And no error message should be shown
  And the login button should remain disabled

Scenario: OTP field validation - special characters blocked
  Given I am on the OTP verification page
  When I try to enter "@#$%" in the OTP number input field
  Then the input should block the characters from being entered
  And no error message should be shown
  And the OTP field should remain empty
  And the login button should remain disabled

Scenario: OTP field validation - spaces blocked
  Given I am on the OTP verification page
  When I try to enter "12 34" in the OTP number input field
  Then the space character should be blocked from entry
  And only the digits "1234" should be accepted
  And no error message should be shown
  And the login button should become enabled if the OTP is valid
```

#### 3.3 OTP Management
```gherkin
Scenario: Resend OTP functionality
  Given I am on the OTP verification page
  And I have received an OTP
  When I wait for 60 seconds
  Then the resend OTP button should be enabled
  And when I click the resend OTP button
  Then a new OTP should be sent to my email
  And the old OTP should no longer be valid
  And the resend OTP button should be disabled again

Scenario: Copy OTP functionality
  Given I am on the OTP verification page
  And I have received an OTP "1234"
  When I click the copy OTP button
  Then the OTP "1234" should be copied to clipboard
  And I should see a success message "OTP copied to clipboard"
  When I paste the copied OTP into the OTP field
  Then the field should contain "1234"
  And the login button should be enabled
```

### 4. Page Refresh Tests

#### 4.1 Form State Management
```gherkin
Scenario: Refresh on authentication page with filled form
  Given I am a new user
  When I enter "John" in the first name field
  And I enter "Doe" in the last name field
  And I enter "john.doe@example.com" in the email field
  And I refresh the page
  Then all form fields should be empty
  And I should remain on the authentication page

Scenario: Refresh on OTP verification page
  Given I am on the OTP verification page
  And I have received an OTP
  When I enter "123456" in the OTP field
  And I refresh the page
  Then the OTP field should be empty
  And the login button should be disabled
  And the resend OTP button should be disabled
  And I should remain on the OTP verification page
  And I should see a message "Please request a new OTP"

Scenario: Refresh after OTP expiration
  Given I am on the OTP verification page
  And I have received an OTP
  When I wait for 60 seconds
  And I refresh the page
  Then the OTP field should be empty
  And the resend OTP button should be enabled
  And I should remain on the OTP verification page
  And I should see a message "Your OTP has expired. Please request a new one"
```

### 5. Success Flow Tests

#### 5.1 New User Flow
```gherkin
Scenario: New user signup with valid details
  Given I am a new user
  When I enter "John" in the first name field
  And I enter "Doe" in the last name field
  And I enter "john.doe@example.com" in the email field
  And I click the signup button
  Then I should be redirected to the OTP verification page
  And an OTP should be sent to "john.doe@example.com"
```

#### 5.2 Existing User Flow
```gherkin
Scenario: Existing user login with valid email
  Given I am an existing user
  When I enter "john.doe@example.com" in the email field
  And I click the login button
  Then I should be redirected to the OTP verification page
  And an OTP should be sent to "john.doe@example.com"
```

## Test Coverage Summary
1. Form Validation
   - Required fields
   - Email format
   - Input formatting (trimming, case sensitivity, special characters)

2. Navigation Flow
   - Form field navigation (tab order, enter key)
   - Browser navigation (back button)
   - Page transitions

3. OTP Functionality
   - OTP validation
   - Input restrictions
   - OTP management (resend, copy)

4. Page Refresh Handling
   - Form state persistence
   - OTP state management
   - Session handling

5. Success Flows
   - New user registration
   - Existing user login
   - OTP verification 