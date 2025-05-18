# Category Management Test Cases

## Overview

This document outlines test cases for the category management module where only Tech Leads have permissions to add, update, and delete categories.

## Test Scenarios

### Access Control

```gherkin
Feature: Category Management
As a Tech Lead
I want to manage categories
So that I can organize content effectively

Background:
  Given I am logged into the system

Scenario: Tech Lead can view categories
  Given I am a Tech Lead
  When I navigate to the category management page
  Then I should see a list of all categories
  And I should see options to add, edit, and delete categories

Scenario: Non-Tech Lead cannot access category management
  Given I am a regular user
  When I try to access the category management page
  Then I should be redirected to the unauthorized page
  And I should see an "Access Denied" message
```

### Category Creation

```gherkin
Scenario: Tech Lead can add a new category
  Given I am a Tech Lead
  And I am on the category management page
  When I click "Add New Category"
  And I enter the following category details:
    | name        | description           | status   |
    | Frontend    | Frontend technologies | active   |
  And I click "Save"
  Then I should see a success message
  And the new category should appear in the list

Scenario: Tech Lead cannot create duplicate category
  Given I am a Tech Lead
  And a category "Mobile" already exists
  When I try to create another category with name "Mobile"
  Then I should see an error message "Category name already exists"
  And the new category should not be created

Scenario: Tech Lead must provide required fields
  Given I am a Tech Lead
  When I try to create a new category
  And I leave the name field empty
  Then I should see validation error "Name is required"
  And the category should not be created
```

### Category Update

```gherkin
Scenario: Tech Lead can edit existing category
  Given I am a Tech Lead
  And I am on the category management page
  And there is an existing category "Backend"
  When I click edit on "Backend" category
  And I update the following details:
    | name        | description           | status   |
    | Backend Dev | Backend development   | active   |
  And I click "Save"
  Then I should see a success message
  And the category should be updated with new details

```

### Category Deletion

```gherkin
Scenario: Tech Lead can delete category
  Given I am a Tech Lead
  And I am on the category management page
  And there is an existing category "DevOps"
  When I click delete on "DevOps" category
  And I confirm the deletion
  Then I should see a success message
  And the "DevOps" category should no longer appear in the list

```

Test Coverage Summary

#Access Control
Tech Lead access verification
Non-Tech Lead access restrictions
Permission validation

#Category Creation
New category addition
Duplicate category validation
Required field validation
Success/error message handling

#Category Update
Edit existing categories
Field modification
Update validation
Success confirmation

#Category Deletion
Category removal
Deletion confirmation
Success verification
List update validation
