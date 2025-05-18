# Team Member CRUD Operations Test Cases

## Feature: Team Member Management

As a team member
I want to create and manage teams with members
So that I can organize team structures effectively

## Background

Given I am logged in as a team member
And I am on the team management dashboard
And the following members exist in the system:
| Name | Email |
| Alice Cooper | alice@email.com |
| Bob Wilson | bob@email.com |
| Carol Smith | carol@email.com |

### 1. Create Team Tests

#### 1.1 Basic Creation

```gherkin
Scenario: Successfully create a new team
  Given I am on the team creation page
  When I fill in the team name "Mobile Team"
  And I select the following members:
    | Member Name    |
    | Alice Cooper   |
    | Bob Wilson     |
  And I click the "Create Team" button
  Then I should see a success message "Team created successfully"
  And the new team should appear in the teams list
  And selected members should be shown under the team

Scenario: Create team with missing team name
  Given I am on the team creation page
  When I select members:
    | Member Name    |
    | Alice Cooper   |
  And I leave the team name empty
  And I click the "Create Team" button
  Then I should see a validation error "Team name is required"
  And the team should not be created

Scenario: Create team without selecting any member
  Given I am on the team creation page
  When I fill in the team name "Frontend Team"
  And I don't select any members
  And I click the "Create Team" button
  Then I should see a validation error "At least one member must be selected"
  And the team should not be created

Scenario: Create team with duplicate name
  Given I am on the team creation page
  And a team named "Mobile Team" already exists
  When I fill in the team name "Mobile Team"
  And I select members:
    | Member Name    |
    | Carol Smith    |
  And I click the "Create Team" button
  Then I should see an error message "Team name already exists"
  And the team should not be created
```

### 2. Update Team Tests

#### 2.1 Basic Updates

```gherkin
Scenario: Successfully update team name
  Given I am viewing the "Mobile Team" details
  When I click the "Edit" button
  And I update the team name to "Mobile Dev Team"
  And I click the "Save Changes" button
  Then I should see a success message "Team updated successfully"
  And the team name should be updated in the list

Scenario: Update team members
  Given I am viewing the "Mobile Team" details
  When I click the "Edit" button
  And I deselect "Bob Wilson"
  And I select "Carol Smith"
  And I click the "Save Changes" button
  Then I should see a success message "Team members updated successfully"
  And the team members list should be updated
  And "Carol Smith" should be shown as a team member
  And "Bob Wilson" should not be shown as a team member

Scenario: Update team with empty name
  Given I am viewing the "Mobile Team" details
  When I click the "Edit" button
  And I clear the team name
  And I click the "Save Changes" button
  Then I should see a validation error "Team name is required"
  And the team should not be updated

Scenario: Update team by removing all members
  Given I am viewing the "Mobile Team" details
  When I click the "Edit" button
  And I deselect all members
  And I click the "Save Changes" button
  Then I should see a validation error "At least one member must be selected"
  And the team members should not be updated
```

### 3. Delete Team Tests

#### 3.1 Basic Deletion

```gherkin
Scenario: Successfully delete team
  Given I am viewing the teams list
  When I select the "Mobile Team" to delete
  And I click the "Delete Team" button
  And I confirm the deletion
  Then I should see a success message "Team deleted successfully"
  And the team should be removed from the list
  And the members should no longer be associated with the team

Scenario: Cancel team deletion
  Given I am viewing the teams list
  When I select the "Mobile Team" to delete
  And I click the "Delete Team" button
  And I cancel the deletion confirmation
  Then the team should remain in the list
  And all member associations should remain intact
```

### 4. Search and Filter Tests

#### 4.1 Team Search

```gherkin
Scenario: Search teams by name
  Given I am on the teams list
  When I enter "Mobile" in the search field
  Then I should see all teams with "Mobile" in their name
  And the results should be filtered instantly

Scenario: Filter teams by member
  Given I am on the teams list
  When I select "Alice Cooper" from the member filter
  Then I should only see teams that include "Alice Cooper"
  And the list should update automatically
```

## Test Coverage Matrix

| Operation | Basic | Validation | Member Selection |
| --------- | ----- | ---------- | ---------------- |
| Create    | ✅    | ✅         | ✅               |
| Update    | ✅    | ✅         | ✅               |
| Delete    | ✅    | N/A        | ✅               |
| Search    | ✅    | N/A        | ✅               |

## Critical Test Scenarios

1. Team Name Validation
2. Required Member Selection
3. Duplicate Team Name Prevention
4. Member Association Management
5. Search and Filter Functionality
