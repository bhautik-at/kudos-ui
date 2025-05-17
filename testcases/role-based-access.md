# Role-Based Access Control Test Cases

## Feature: Role-Based Access Control with Unified Dashboard
As a user signing up via invitation or fresh registration
I want to be directed to a shared dashboard where my experience changes based on my role
So that I can access only the features appropriate to my assigned role

## Background
Given I am on the authentication page
And the page title is "Authentication"

## Test Categories

### 1. Invited User Signup Tests

#### 1.1 Team Member Signup
```gherkin
Scenario: Team member signup with valid invitation
  Given I land on the signup page with a valid invitationCode in the URL
  When the system verifies the invitation code
  And identifies my role as "Team Member"
  And I complete the registration form with valid details
  Then I should be redirected to the shared dashboard
  And I should see the kudos view section
  And I should not see the create kudos button
  And I should not see the organization management section
  And I should not see the team management section

Scenario: Team member signup with expired invitation
  Given I land on the signup page with an expired invitationCode in the URL
  When I try to complete the registration form
  Then I should see an error message "Invitation has expired"
  And I should be redirected to the invitation expired page
  And I should see an option to request a new invitation
```

#### 1.2 Tech Lead Signup
```gherkin
Scenario: Tech Lead signup with valid invitation
  Given I land on the signup page with a valid invitationCode in the URL
  When the system verifies the invitation code
  And identifies my role as "Tech Lead"
  And I complete the registration form with valid details
  Then I should be redirected to the shared dashboard
  And I should see the kudos view section
  And I should see the create kudos button
  And I should see the organization management section
  And I should see the team management section

Scenario: Tech Lead signup with invalid invitation
  Given I land on the signup page with an invalid invitationCode in the URL
  When I try to complete the registration form
  Then I should see an error message "Invalid invitation code"
  And I should be redirected to the error page
  And I should see an option to contact support
```

### 2. Fresh User Signup Tests

#### 2.1 Default Tech Lead Creation
```gherkin
Scenario: Fresh user signup as default Tech Lead
  Given I land on the signup page without an invitationCode
  When I complete the registration form with valid details
  Then I should be assigned the Tech Lead role by default
  And I should be redirected to the shared dashboard
  And the "Create Organization" form should be opened automatically
  And I should see the kudos view section
  And I should see the create kudos button
  And I should see the organization management section
  And I should see the team management section

Scenario: Fresh user signup with invalid details
  Given I land on the signup page without an invitationCode
  When I complete the registration form with invalid details
  Then I should see appropriate validation error messages
  And I should remain on the signup page
  And the "Create Organization" form should not be opened
```

### 3. Dashboard Access Control Tests

#### 3.1 Team Member Dashboard Access
```gherkin
Scenario: Team member dashboard features
  Given I am logged in as a Team Member
  When I navigate to the dashboard
  Then I should see the kudos view section
  And I should not see the create kudos button
  And I should not see the organization management section
  And I should not see the team management section
  When I try to access the organization settings URL directly
  Then I should be redirected to the dashboard
  And I should see an error message "Access denied"

Scenario: Team member kudos interaction
  Given I am logged in as a Team Member
  When I navigate to the kudos section
  Then I should be able to view all kudos
  And I should be able to filter and search kudos
  And I should not see the create kudos button
  When I try to access the create kudos URL directly
  Then I should be redirected to the kudos view
  And I should see an error message "Access denied"
```

#### 3.2 Tech Lead Dashboard Access
```gherkin
Scenario: Tech Lead dashboard features
  Given I am logged in as a Tech Lead
  When I navigate to the dashboard
  Then I should see the kudos view section
  And I should see the create kudos button
  And I should see the organization management section
  And I should see the team management section
  When I click the create kudos button
  Then I should be able to create a new kudos
  When I navigate to organization settings
  Then I should be able to manage organization details
  And I should be able to invite team members
  And I should be able to manage roles

Scenario: Tech Lead organization management
  Given I am logged in as a Tech Lead
  When I navigate to organization settings
  Then I should be able to view organization details
  And I should be able to edit organization details
  And I should be able to manage team members
  And I should be able to assign roles
  And I should be able to configure organization settings
```

### 4. Role Transition Tests

#### 4.1 Role Upgrade
```gherkin
Scenario: Team member upgraded to Tech Lead
  Given I am logged in as a Team Member
  When a Tech Lead upgrades my role
  Then I should be notified of the role change
  And I should see the create kudos button
  And I should see the organization management section
  And I should see the team management section
  When I refresh the page
  Then all new permissions should persist
```

#### 4.2 Role Downgrade
```gherkin
Scenario: Tech Lead downgraded to Team Member
  Given I am logged in as a Tech Lead
  When my role is downgraded to Team Member
  Then I should be notified of the role change
  And I should no longer see the create kudos button
  And I should no longer see the organization management section
  And I should no longer see the team management section
  When I refresh the page
  Then all restricted permissions should persist
```

### 5. Unified Dashboard Experience Tests

#### 5.1 Shared Dashboard Layout
```gherkin
Scenario: Common dashboard elements for all roles
  Given I am logged in to the platform
  When I access the dashboard
  Then I should see the common header with user profile
  And I should see the navigation menu
  And I should see the kudos feed section
  And I should see the notifications area
  And I should see the search functionality
  And I should see the help/support section

Scenario: Role-specific dashboard elements
  Given I am logged in to the platform
  When I access the dashboard
  Then I should see role-specific navigation items
  And I should see role-specific action buttons
  And I should see role-specific statistics
  And I should see role-specific quick actions
```

#### 5.2 Dynamic Content Loading
```gherkin
Scenario: Dashboard content based on role
  Given I am logged in to the platform
  When I access the dashboard
  Then the system should load role-specific content
  And the system should cache common elements
  And the system should lazy load role-specific features
  And the system should maintain consistent layout

Scenario: Dashboard performance with role changes
  Given I am logged in to the platform
  When my role is changed
  Then the dashboard should update without full page reload
  And the common elements should remain stable
  And only the role-specific content should refresh
  And the user experience should remain smooth
```

#### 5.3 Responsive Dashboard Behavior
```gherkin
Scenario: Dashboard adaptation to role changes
  Given I am logged in to the platform
  When I switch between different roles
  Then the dashboard should adapt its layout
  And the navigation should update accordingly
  And the available actions should change
  And the content should refresh appropriately

Scenario: Dashboard state persistence
  Given I am logged in to the platform
  When I navigate away from the dashboard
  And I return to the dashboard
  Then my previous view state should be preserved
  And my role-specific settings should be maintained
  And my last viewed content should be restored
```

#### 5.4 Cross-Role Interactions
```gherkin
Scenario: Team member viewing Tech Lead actions
  Given I am logged in as a Team Member
  When I see a Tech Lead performing an action
  Then I should see a simplified version of the action
  And I should not see sensitive information
  And I should see appropriate context for the action

Scenario: Tech Lead viewing Team Member activities
  Given I am logged in as a Tech Lead
  When I view Team Member activities
  Then I should see detailed information
  And I should see management controls
  And I should see performance metrics
```

#### 5.5 Dashboard Personalization
```gherkin
Scenario: Role-based dashboard customization
  Given I am logged in to the platform
  When I customize my dashboard
  Then the system should save my preferences
  And the preferences should be role-specific
  And the layout should adapt to my role
  And my customizations should persist across sessions

Scenario: Dashboard widget management
  Given I am logged in to the platform
  When I manage dashboard widgets
  Then I should see role-appropriate widgets
  And I should be able to arrange widgets
  And I should be able to add/remove widgets
  And my widget configuration should be saved
```

## Test Coverage Summary
1. Invited User Signup
   - Team Member signup flow
   - Tech Lead signup flow
   - Invitation validation

2. Fresh User Signup
   - Default Tech Lead assignment
   - Organization creation flow
   - Form validation

3. Dashboard Access Control
   - Team Member restrictions
   - Tech Lead permissions
   - Feature visibility

4. Role Transitions
   - Role upgrade flow
   - Role downgrade flow
   - Permission persistence

5. Unified Dashboard Experience
   - Shared dashboard layout
   - Dynamic content loading
   - Responsive behavior
   - Cross-role interactions
   - Personalization options

## Role Capabilities Matrix
| Role | View Kudos | Create Kudos | Create Organization | Manage Team | Manage Roles |
|------|------------|--------------|---------------------|-------------|--------------|
| Tech Lead | ✅ | ✅ | ✅ | ✅ | ✅ |
| Team Member | ✅ | ❌ | ❌ | ❌ | ❌ | 

## Dashboard Features Matrix
| Feature | Tech Lead | Team Member | Common |
|---------|-----------|-------------|---------|
| Header | ✅ | ✅ | ✅ |
| Navigation | Role-specific | Role-specific | ✅ |
| Kudos Feed | Full access | View only | ✅ |
| Notifications | All types | Limited | ✅ |
| Search | Advanced | Basic | ✅ |
| Quick Actions | All | Limited | ✅ |
| Statistics | Detailed | Summary | ✅ |
| Settings | Full | Limited | ✅ |
| Widgets | All | Limited | ✅ | 