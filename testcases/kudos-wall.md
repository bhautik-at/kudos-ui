# Kudos Wall Feature Test Cases

## Feature: Kudos Wall Display and Creation

As a Tech Lead
I want to create and view kudos on a public wall
So that I can recognize and appreciate team members' contributions

## Test Scenarios

### 1. Kudos Wall Display

**Scenario:** View all kudos on the wall

- Given I am on the Kudos Wall page
- When the page loads
- Then I should see all public kudos displayed
- And each kudo should show recipient name, team, category, and description
- And kudos should be sorted by most recent first

**Scenario:** Filter kudos by recipient

- Given I am on the Kudos Wall page
- When I enter a recipient name in the search field
- Then I should see only kudos for that recipient
- And the filter should work with partial name matches

**Scenario:** Filter kudos by team

- Given I am on the Kudos Wall page
- When I select a team from the team filter
- Then I should see only kudos from that team
- And the team filter should show all available teams

**Scenario:** Filter kudos by category

- Given I am on the Kudos Wall page
- When I select a category from the category filter
- Then I should see only kudos in that category
- And the category filter should show all available categories

**Scenario:** Combine multiple filters

- Given I am on the Kudos Wall page
- When I apply multiple filters (recipient, team, category)
- Then I should see kudos matching all selected criteria
- And the results should update in real-time

### 2. Create Kudo Functionality

**Scenario:** Tech Lead can see create kudo button

- Given I am logged in as a Tech Lead
- When I visit the Kudos Wall page
- Then I should see a "Create Kudo" button in the header

**Scenario:** Non-Tech Lead cannot see create kudo button

- Given I am logged in as a regular user
- When I visit the Kudos Wall page
- Then I should not see the "Create Kudo" button

**Scenario:** Open create kudo form

- Given I am logged in as a Tech Lead
- When I click the "Create Kudo" button
- Then a form should open with fields for name, team, category, and description

### 3. AutoComplete Functionality

**Scenario:** Name field autocomplete

- Given I am on the create kudo form
- When I start typing in the name field
- Then I should see a dropdown with matching names
- And the dropdown should filter names as I type
- And clicking a name should fill the field

**Scenario:** Team field autocomplete

- Given I am on the create kudo form
- When I start typing in the team field
- Then I should see a dropdown with matching teams
- And the dropdown should filter teams as I type
- And clicking a team should fill the field

**Scenario:** Category field autocomplete

- Given I am on the create kudo form
- When I start typing in the category field
- Then I should see a dropdown with matching categories
- And the dropdown should filter categories as I type
- And clicking a category should fill the field

**Scenario:** Autocomplete with no matches

- Given I am on the create kudo form
- When I type a non-existent name/team/category
- Then the dropdown should show "No matches found"
- And I should still be able to type freely

### 4. Form Validation

**Scenario:** Submit kudo with valid data

- Given I am on the create kudo form
- When I fill in all required fields with valid data
- And I click the submit button
- Then the kudo should be created successfully
- And I should see a success message
- And the new kudo should appear on the wall

**Scenario:** Submit kudo with missing required fields

- Given I am on the create kudo form
- When I leave required fields empty
- And I click the submit button
- Then the form should show validation errors
- And the kudo should not be created

**Scenario:** Submit kudo with invalid data

- Given I am on the create kudo form
- When I enter invalid data in any field
- And I click the submit button
- Then the form should show appropriate error messages
- And the kudo should not be created

### 5. Error Handling

**Scenario:** Network error during kudo creation

- Given I am on the create kudo form
- When the network connection fails
- And I try to submit the form
- Then I should see an error message
- And the form data should be preserved

**Scenario:** Server error during kudo creation

- Given I am on the create kudo form
- When the server returns an error
- And I try to submit the form
- Then I should see an appropriate error message
- And the form data should be preserved

### 6. Team Member View Restrictions

**Scenario:** Team member can see their own kudos

- Given I am logged in as a team member
- When I visit the Kudos Wall page
- Then I should see all kudos where I am the recipient
- And I should not see the "Create Kudo" button

**Scenario:** Team member can filter kudos by date

- Given I am logged in as a team member
- When I select a date range from the date filter
- Then I should see only kudos within that date range
- And the date filter should show calendar picker

**Scenario:** Team member can filter kudos by category

- Given I am logged in as a team member
- When I select a category from the category filter
- Then I should see only kudos in that category
- And the category filter should show all available categories

**Scenario:** Team member can combine date and category filters

- Given I am logged in as a team member
- When I select both a date range and a category
- Then I should see only kudos matching both criteria
- And the results should update in real-time

**Scenario:** Team member cannot access create kudo form

- Given I am logged in as a team member
- When I try to access the create kudo form directly
- Then I should be redirected to the Kudos Wall
- And I should see an access denied message

**Scenario:** Team member can view kudos from all teams

- Given I am logged in as a team member
- When I visit the Kudos Wall page
- Then I should see kudos from all teams
- And I should be able to filter by team name

**Scenario:** Team member can sort kudos by date

- Given I am logged in as a team member
- When I click the date sort option
- Then I should see kudos sorted by date
- And I should be able to toggle between ascending and descending order

### 7. Category-wise Viewing

**Scenario:** View kudos by specific category

- Given I am on the Kudos Wall page
- When I select "Technical Excellence" category
- Then I should see only kudos in the Technical Excellence category
- And each kudo should display its category label

**Scenario:** View kudos by multiple categories

- Given I am on the Kudos Wall page
- When I select multiple categories (e.g., "Team Player" and "Innovation")
- Then I should see kudos from both selected categories
- And the results should be clearly labeled with their respective categories

**Scenario:** Category filter persistence

- Given I am on the Kudos Wall page
- When I select a category
- And I navigate away and come back
- Then the category filter should remain selected
- And the filtered results should still be visible

**Scenario:** Clear category filter

- Given I am on the Kudos Wall page with an active category filter
- When I click the clear filter button
- Then all category filters should be removed
- And I should see kudos from all categories

**Scenario:** Category filter with no results

- Given I am on the Kudos Wall page
- When I select a category that has no kudos
- Then I should see a "No kudos found" message
- And the message should suggest trying a different category

### 8. Advanced Search and Filter Scenarios

**Scenario:** Tech Lead searches kudos by team member name

- Given I am logged in as a Tech Lead
- When I enter a team member's name in the search field
- Then I should see kudos where that member is either recipient or sender
- And the search should work with partial name matches
- And results should update in real-time

**Scenario:** Tech Lead filters kudos by date range

- Given I am logged in as a Tech Lead
- When I select a start date and end date from the date picker
- Then I should see kudos created within that date range
- And the results should be sorted by date descending
- And I should be able to clear the date filter

**Scenario:** Tech Lead combines multiple search criteria

- Given I am logged in as a Tech Lead
- When I enter a team member name
- And select a specific team
- And choose a category
- And set a date range
- Then I should see kudos matching all selected criteria
- And I should be able to remove any filter individually
- And the results should update instantly

**Scenario:** Regular user searches their received kudos

- Given I am logged in as a regular user
- When I use the search field to find kudos with my name
- Then I should see kudos where I am the recipient
- And I should not see kudos where I am not involved

**Scenario:** Regular user filters kudos by date and category

- Given I am logged in as a regular user
- When I select a date range
- And choose a specific category
- Then I should see kudos matching both criteria
- And I should only see kudos where I am the recipient
- And I should be able to clear filters independently

**Scenario:** Search with no results

- Given I am logged in as either Tech Lead or regular user
- When I enter search criteria that match no kudos
- Then I should see a "No kudos found" message
- And I should see suggestions to modify my search
- And all filters should remain active until cleared

**Scenario:** Filter persistence across sessions

- Given I have applied multiple filters
- When I refresh the page or close and reopen the browser
- Then my previously selected filters should remain active
- And I should see the same filtered results
- And I should have a "Clear all filters" option

## Test Coverage Summary

- Total Test Scenarios: 32
- Feature Areas Covered:
  1. Kudos Wall Display (5 scenarios)
     - Basic display
     - Filtering by recipient
     - Filtering by team
     - Filtering by category
     - Combined filtering
  2. Create Kudo Functionality (3 scenarios)
     - Tech Lead button visibility
     - Non-Tech Lead restrictions
     - Form opening behavior
  3. AutoComplete Functionality (4 scenarios)
     - Name field
     - Team field
     - Category field
     - No matches handling
  4. Form Validation (3 scenarios)
     - Valid data submission
     - Required fields
     - Invalid data
  5. Error Handling (2 scenarios)
     - Network errors
     - Server errors
  6. Team Member View Restrictions (7 scenarios)
     - Own kudos view
     - Date filtering
     - Category filtering
     - Combined filters
     - Access restrictions
     - Team viewing
     - Date sorting
  7. Category-wise Viewing (5 scenarios)
     - Single category
     - Multiple categories
     - Filter persistence
     - Clear filters
     - Empty results
  8. Advanced Search and Filter Scenarios (7 scenarios)
     - Tech Lead search capabilities
     - Date range filtering
     - Combined search criteria
     - Regular user search restrictions
     - Date and category filtering
     - Empty results handling
     - Filter persistence
