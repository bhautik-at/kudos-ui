# Role-Based Access Control Test Cases

## Feature: Role-Based Access Control with Unified Dashboard
As a user
I want to access a shared dashboard where my experience changes based on my role
So that I can access only the features appropriate to my assigned role

## Background
Given I am logged in to the platform
And I am on the dashboard page

## Test Categories

### 1. Team Member Dashboard Tests

#### 1.1 Basic Access
```gherkin
Scenario: Team member dashboard view
  Given I am logged in as a Team Member
  When I access the dashboard
  Then I should see the kudos view section
  And I should not see the create kudos button
  And I should not see the organization management section
  And I should not see the team management section

Scenario: Team member restricted access
  Given I am logged in as a Team Member
  When I try to access the organization settings URL directly
  Then I should be redirected to the dashboard
  And I should see an error message "Access denied"
```

#### 1.2 Team Member Features
```gherkin
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

### 2. Tech Lead Dashboard Tests

#### 2.1 Basic Access
```gherkin
Scenario: Tech Lead dashboard view
  Given I am logged in as a Tech Lead
  When I access the dashboard
  Then I should see the kudos view section
  And I should see the create kudos button
  And I should see the organization management section
  And I should see the team management section

Scenario: Tech Lead full access
  Given I am logged in as a Tech Lead
  When I navigate to organization settings
  Then I should be able to manage organization details
  And I should be able to invite team members
  And I should be able to manage roles
```

#### 2.2 Tech Lead Features
```gherkin
Scenario: Tech Lead organization management
  Given I am logged in as a Tech Lead
  When I navigate to organization settings
  Then I should be able to view organization details
  And I should be able to edit organization details
  And I should be able to manage team members
  And I should be able to assign roles
  And I should be able to configure organization settings
```

### 3. Shared Dashboard Experience

#### 3.1 Common Elements
```gherkin
Scenario: Common dashboard elements
  Given I am logged in to the platform
  When I access the dashboard
  Then I should see the common header with user profile
  And I should see the navigation menu
  And I should see the kudos feed section
  And I should see the notifications area
  And I should see the search functionality
  And I should see the help/support section
```

#### 3.2 Dynamic Content
```gherkin
Scenario: Role-based content loading
  Given I am logged in to the platform
  When I access the dashboard
  Then the system should load role-specific content
  And the system should cache common elements
  And the system should maintain consistent layout
```

### 4. Role Transition Tests

#### 4.1 Role Upgrade
```gherkin
Scenario: Team member upgraded to Tech Lead
  Given I am logged in as a Team Member
  When my role is upgraded to Tech Lead
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

### 5. Dual Role Tests

#### 5.1 Tech Lead as Team Member
```gherkin
Scenario: Tech Lead viewing team member features
  Given I am logged in as a Tech Lead
  And I am a member of a team
  When I switch to team member view
  Then I should see the team member dashboard
  And I should see my team's kudos feed
  And I should see my team's activities
  And I should see my personal kudos
  And I should not see management controls in team view

Scenario: Tech Lead participating as team member
  Given I am logged in as a Tech Lead
  And I am a member of a team
  When I switch to team member view
  And I interact with team features
  Then I should be able to view team kudos
  And I should be able to filter team activities
  And I should be able to view team statistics
  And I should see the same view as other team members
```

#### 5.2 Role Switching
```gherkin
Scenario: Switching between Tech Lead and Team Member views
  Given I am logged in as a Tech Lead
  And I am a member of a team
  When I switch to team member view
  Then I should see team member interface
  When I switch back to Tech Lead view
  Then I should see Tech Lead interface
  And all management controls should be restored
  And I should maintain my Tech Lead permissions

Scenario: Role-specific actions in different views
  Given I am logged in as a Tech Lead
  And I am a member of a team
  When I am in team member view
  Then I should not see management actions
  When I switch to Tech Lead view
  Then I should see all management actions
  And I should be able to perform Tech Lead tasks
```

#### 5.3 Data Separation
```gherkin
Scenario: Separate data views for different roles
  Given I am logged in as a Tech Lead
  And I am a member of a team
  When I am in team member view
  Then I should only see team-level data
  And I should not see organization-wide data
  When I switch to Tech Lead view
  Then I should see organization-wide data
  And I should see team-level data
  And I should see management statistics

Scenario: Role-specific notifications
  Given I am logged in as a Tech Lead
  And I am a member of a team
  When I am in team member view
  Then I should receive team member notifications
  When I switch to Tech Lead view
  Then I should receive Tech Lead notifications
  And I should see management alerts
```

#### 5.4 Permission Management
```gherkin
Scenario: Role-based permission enforcement
  Given I am logged in as a Tech Lead
  And I am a member of a team
  When I am in team member view
  Then I should not be able to access management features
  And I should not be able to modify team settings
  When I switch to Tech Lead view
  Then I should have full management access
  And I should be able to modify team settings

Scenario: Cross-role data access
  Given I am logged in as a Tech Lead
  And I am a member of a team
  When I am in team member view
  Then I should only see my team's kudos
  When I switch to Tech Lead view
  Then I should see all teams' kudos
  And I should see organization-wide statistics
```

## Test Coverage Summary
1. Team Member Dashboard
   - Basic access restrictions
   - Available features
   - Restricted features

2. Tech Lead Dashboard
   - Full access capabilities
   - Management features
   - Organization settings

3. Shared Dashboard Experience
   - Common elements
   - Dynamic content loading
   - Consistent layout

4. Role Transitions
   - Role upgrade flow
   - Role downgrade flow
   - Permission persistence

5. Dual Role Tests
   - Tech Lead as Team Member view
   - Role switching functionality
   - Data separation between roles
   - Permission management
   - Cross-role data access

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

## Role Capabilities Matrix
| Feature | Tech Lead View | Team Member View | Common |
|---------|---------------|------------------|---------|
| Team Kudos | All teams | Own team only | ✅ |
| Management | Full access | No access | ✅ |
| Statistics | Organization-wide | Team-level | ✅ |
| Notifications | All types | Team only | ✅ |
| Settings | Full access | View only | ✅ |
| Activities | All teams | Own team | ✅ | 