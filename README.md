# Branch Viewer

This component displays Norwegian Red Cross branch hierarchy information from an API endpoint. It shows the organizational structure from main office through districts down to local branches (lokalforeninger).

## Purpose
The Branch Viewer is designed to be embedded into any webpage, providing a consistent way to display Red Cross organizational structure. It shows branch details including:
- Branch hierarchy (main office -> district -> local branch)
- Contact information
- Address details
- Status information


## Functionality

browsing:
- view all branches on a map of Norway
- view all branches as list or list of cards with collapsible details

Searching:
- search for a branch by name
- search for a branch by address
- search for a branch by activity

filtering:
- filter branches by type (lokalforening or distrikt)
- filter branches by status (active or terminated)
- filter branches by activity

sorting:
- sort branches by name
- sort branches by address
- sort branches by activity







## Technical Implementation

### Core Technologies
- React 18+ with TypeScript for robust development
- shadcn/ui for pre-built, accessible UI components
- Tailwind CSS for styling

### UI Components
We use shadcn/ui components for a consistent, accessible interface:
- Collapsible: For expandable/collapsible branch view
- Card: For displaying branch information
- Sheet: For mobile-friendly detailed views

### Build & Development Tools
- Vite for fast development and optimized builds
- TypeScript for type safety
- PostCSS for CSS processing
- ESLint and Prettier for code quality

## Usage
To include the Branch Viewer in a webpage, add these two lines:

```html
<!-- Branch Viewer styles -->
<link rel="stylesheet" href="https://norwegianredcross.github.io/branch-viewer/dist/branch-viewer.css">

<!-- Branch Viewer script -->
<script src="https://norwegianredcross.github.io/branch-viewer/dist/branch-viewer.js"></script>

<!-- The component will render here -->
<div id="rc-branch-viewer"></div>
```

## API Integration

The component integrates with the Red Cross Organizations API v1.0.0. This API provides detailed information about branches, including branch details, organizational hierarchy, contact information, and geographic location.

### API Endpoints
- Base URL: `https://api-dev.redcross.no`
- Endpoint: `/nrx/v1/organizations`
- Authentication: none

### Response Format Example
```json
{
    "data": {
        "branches": [
            {
                "branchId": "L267",
                "branchNumber": "1700198",
                "organizationNumber": "971475285",
                "branchType": "Lokalforening",
                "branchName": "Kolvereid Røde Kors",
                "branchStatus": {
                    "isActive": true,
                    "creationDate": "1948-05-25",
                    "terminationDate": null,
                    "isTerminated": false
                },
                "parent": {
                    "branchId": "D014",
                    "branchNumber": "1709917",
                    "branchName": "Nord-Trøndelag RK",
                    "branchType": "Distrikt"
                },
                "organizationDetails": {
                    "description": "Langfjord Røde Kors",
                    "organizationLevel": "875880002"
                },
                "addresses": {
                    "municipality": null,
                    "region": null,
                    "postal": {
                        "addressLine1": "Nordre veg 30, Sjøfartsgata 3",
                        "addressLine2": null,
                        "postalCode": "7970",
                        "postOffice": "KOLVEREID"
                    },
                    "visiting": null
                },
                "communicationChannels": {
                    "phone": "",
                    "email": "kolvereid@rodekors.org",
                    "web": null
                },
                "geometry": null,
                "branchContacts": [
                    {
                        "role": "Nestleder",
                        "firstName": "Sten",
                        "lastName": "Johansen",
                        "email": "sten.johansen@rodekors.org",
                        "phone": "+47 96232866",
                        "jobTitle": null,
                        "isVolunteer": true,
                        "isMember": true,
                        "memberNumber": "7146223"
                    },
                    {
                        "role": "Webredaktør",
                        "firstName": "Webredaktør i Kolvereid Røde Kors",
                        "lastName": "id: 23",
                        "email": "kolvereid@rodekors.org",
                        "phone": null,
                        "jobTitle": null,
                        "isVolunteer": true,
                        "isMember": true,
                        "memberNumber": "7146223"
                    },
                    {
                        "role": "Leder",
                        "firstName": "Kari",
                        "lastName": "Strøm",
                        "email": "kari.strom@rodekors.org",
                        "phone": "+47 95023330",
                        "jobTitle": null,
                        "isVolunteer": true,
                        "isMember": true,
                        "memberNumber": "5516274"
                    }
                ],
                "branchActivities": [
                    "Kolvereid Røde Kors Kursholder",
                    "Kolvereid Røde Kors Flyktningeguide",
                    "Kolvereid Røde Kors Beredskapsvakt",
                    "Kolvereid Røde Kors Besøkstjeneste",
                    "Kolvereid Røde Kors Hjelpekorps"
                ]
            },
        ]
    },
    "metadata": {
        "totalCount": 384,
        "timestamp": "2025-02-17T14:16:57.819Z"
    }
}            
```

### Data Structures

#### Branch Information

Each branch contains:

- `branchId`: Unique identifier (e.g., "L267")
- `branchNumber`: Organization number (e.g., "1700198")
- `branchType`: Either "Lokalforening" or "Distrikt"
- `organizationNumber`: Organization number (e.g., "971475285") can be linked to https://data.brreg.no/enhetsregisteret/api/enheter/971475285
- `branchName`: Name of the branch (e.g., "Kolvereid Røde Kors")
- `branchStatus`: Status of the branch
  - `isActive`: Boolean
  - `creationDate`: Date of creation eg "1948-05-25"
  - `terminationDate`: Date of termination or null
  - `isTerminated`: Boolean
- `parent`: Parent organization details
  - `branchId`: Unique identifier (e.g., "D014")
  - `branchNumber`: Organization number (e.g., "1709917")
  - `branchName`: Name of the parent organization (e.g., "Nord-Trøndelag RK")
  - `branchType`: Either "Lokalforening" or "Distrikt"
- `organizationDetails`: Details about the organization
  - `description`: Description of the organization (e.g., "Langfjord Røde Kors")
  - `organizationLevel`: Organization level (e.g., "875880002")
- `addresses`: Address details
  - `municipality`: Municipality (e.g., "KOLVEREID") or null
  - `region`: Region (e.g., "TRONDHEIM") or null
  - `postal`: Postal address details
    - `addressLine1`: First line of address (e.g., "Nordre veg 30, Sjøfartsgata 3")
    - `addressLine2`: Second line of address or null
    - `postalCode`: Postal code (e.g., "7970")
    - `postOffice`: Post office (e.g., "KOLVEREID")
  - `visiting`: Visiting address details or null
- `communicationChannels`: Communication channels
  - `phone`: Phone number (e.g., "+47 96232866") or null
  - `email`: Email address (e.g., "kolvereid@rodekors.org") or null
  - `web`: Website URL (e.g., "https://www.rodekors.org/kolvereid") or null
- `geometry`: Geometry details or null
- `branchContacts`: Contacts for the branch
  - `role`: Role of the contact (e.g., "Leder")
  - `firstName`: First name of the contact (e.g., "Sten")
  - `lastName`: Last name of the contact (e.g., "Johansen")
  - `email`: Email address (e.g., "sten.johansen@rodekors.org")
  - `phone`: Phone number (e.g., "+47 96232866")
  - `jobTitle`: Job title of the contact or null
  - `isVolunteer`: Boolean
  - `isMember`: Boolean
  - `memberNumber`: Member number (e.g., "7146223")
- `branchActivities`: Array of strings containing the activities of the branch

#### Hierarchical Structure
Branches are organized hierarchically:
- Parent organization details
  - Parent branchId
  - Parent name
  - Parent type


## Project Structure

```
branch-viewer/
├── src/                    # React + TypeScript development files
├── dist/                   # Built files for distribution
│   ├── branch-viewer.js    # Standalone bundled JS
│   └── branch-viewer.css   # Standalone bundled CSS

```


