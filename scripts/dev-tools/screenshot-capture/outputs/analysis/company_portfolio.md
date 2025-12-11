# DOM Analysis: company_portfolio

**Page Title:** Portfolio • Alleato Group
**Analyzed:** 12/3/2025, 2:55:33 PM

## Tables (1)

### Table 1
- **Rows:** 12
- **Has Actions:** No
- **Headers:** , Name, Project Number, Address, City, State, ZIP, Phone, Status, Stage, Type, Notes

## Navigation

**Main Navigation (1 items):**
- ERP Integrations

## Actions/Buttons (3)

- More
- 
- Create Project

## CSS Frameworks Detected

- tailwind
- custom

## AI Analysis

Based on the provided structured data and HTML sample, here are the insights regarding the Procore page:

### 1. Page Purpose and Functionality

**Page Purpose**: 
The page is a portfolio management interface for the **Alleato Group** company, focusing on displaying the details of various construction projects. The main functionality includes viewing project listings with comprehensive details such as project name, number, address, status, stage, type, and notes.

**Core Functionality**:
- **Project Management**: Listing various projects with key details.
- **Navigation**: A structure allowing users to navigate to ERP integrations and potentially other related resources.
- **Action Handling**: Options to create new projects or perform other forms of actions (like searching).

### 2. Key Data Models/Entities

From the structured data, key data models can be identified:

- **Project**:
  - **Attributes**: 
    - Project Name
    - Project Number
    - Address
    - City
    - State
    - ZIP Code
    - Phone Number
    - Status
    - Stage
    - Type
    - Notes

- **User**: 
  - **Attributes**: 
    - User ID
    - User Email
    - Role (e.g., Admin, Project Manager)

- **Company**:
  - **Attributes**: 
    - Company ID
    - Company Name
    - Integration Info

- **Filters**: (used for data querying)
  - Project Status (e.g., Active, Inactive)
  - Project Stage (e.g., Bidding, Construction)

### 3. Component Suggestions for React/Next.js

Given the identification of reusable component patterns within the DOM structure, here are suggested components:

- **PortfolioPage**: The main container component that encapsulates the portfolio functionality.
- **ProjectTable**: A presentational component that displays a table of projects, utilizing the headers and data from the `tables` structure.
- **ProjectRow**: Represents each individual project row in the table.
- **ProjectFilter**: A component for filtering projects based on various criteria.
- **NavigationMenu**: A component for rendering the main navigation and breadcrumbs.
- **CreateProjectButton**: A button component that encapsulates the functionality of creating new projects.
- **ActionDropdown**: A dropdown component for actions like "More" or filtering options.

### 4. Database Schema Recommendations

To support the data models identified, consider the following database schema recommendations:

```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50),
    company_id INTEGER REFERENCES companies(id)
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    project_number VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    phone_number VARCHAR(20),
    status VARCHAR(50),
    stage VARCHAR(50),
    type VARCHAR(50),
    notes TEXT,
    company_id INTEGER REFERENCES companies(id)
);

CREATE TABLE project_filters (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100),
    value VARCHAR(100),
    type VARCHAR(50),
    project_id INTEGER REFERENCES projects(id)
);
```

### 5. API Endpoint Patterns Needed

Here are essential API endpoint patterns that can be implemented:

- **GET** `/api/projects` - Fetch a list of projects with optional filtering.
- **GET** `/api/projects/{id}` - Retrieve details of a specific project.
- **POST** `/api/projects` - Create a new project.
- **PUT** `/api/projects/{id}` - Update an existing project.
- **DELETE** `/api/projects/{id}` - Delete a project by ID.
- **GET** `/api/companies/{id}/users` - Fetch users associated with a specific company.
- **GET** `/api/filter-options` - Retrieve filter options for projects.

### Conclusion

The analysis of the DOM structure has outlined the core functionalities of the Procore page for project portfolio management, identified the key data models, and suggested a modern approach for component implementation, database schema, and API endpoints to facilitate the rebuilding of the application as a modern web solution using React and Next.js.
