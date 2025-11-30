# API Documentation

## Content Management API

### Overview
The Content Management API provides endpoints for creating, reading, updating, and deleting dynamic content across the website.

### Base URL
```
/api/admin/content
```

### Authentication
All endpoints require authentication using NextAuth.js session cookies. Users must have either `ADMIN` or `MANAGER` role.

---

## Endpoints

### Get Content Models
Retrieve all available content models.

**Endpoint:** `GET /api/admin/content-models`

**Response:**
```json
[
  {
    "id": "home-hero",
    "name": "Home Hero Section",
    "description": "Hero section content for homepage",
    "icon": "Home",
    "fields": [...],
    "searchFields": ["title", "subtitle"]
  }
]
```

---

### List Content Items
Get paginated list of content items for a specific model.

**Endpoint:** `GET /api/admin/content/{modelId}`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search query
- `status` (optional): Filter by status (draft, published, etc.)
- `sortBy` (optional): Field to sort by
- `sortOrder` (optional): asc or desc

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "modelId": "home-hero",
      "data": {
        "title": "Welcome to Altavida Tours.com",
        "subtitle": "Discover Ancient Wonders"
      },
      "status": "published",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "createdBy": "user-id"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

---

### Get Single Content Item
Retrieve a specific content item by ID.

**Endpoint:** `GET /api/admin/content/{modelId}/{itemId}`

**Response:**
```json
{
  "id": "uuid",
  "modelId": "home-hero",
  "data": {
  "title": "Welcome to Altavida Tours.com",
    "subtitle": "Discover Ancient Wonders",
    "backgroundImage": "/uploads/hero-bg.jpg"
  },
  "status": "published",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "createdBy": "user-id",
  "versions": [...]
}
```

---

### Create Content Item
Create a new content item.

**Endpoint:** `POST /api/admin/content/{modelId}`

**Request Body (multipart/form-data):**
```json
{
  "title": "New Hero Section",
  "subtitle": "Amazing Journey",
  "backgroundImage": [File],
  "status": "draft"
}
```

**Response:**
```json
{
  "id": "new-uuid",
  "modelId": "home-hero",
  "data": {...},
  "status": "draft",
  "createdAt": "2024-01-01T00:00:00Z",
  "createdBy": "user-id"
}
```

---

### Update Content Item
Update an existing content item.

**Endpoint:** `PATCH /api/admin/content/{modelId}/{itemId}`

**Request Body (multipart/form-data):**
```json
{
  "title": "Updated Hero Section",
  "status": "published"
}
```

**Response:**
```json
{
  "id": "uuid",
  "modelId": "home-hero",
  "data": {...},
  "status": "published",
  "updatedAt": "2024-01-01T00:00:00Z",
  "version": 2
}
```

---

### Delete Content Item
Delete a content item.

**Endpoint:** `DELETE /api/admin/content/{modelId}/{itemId}`

**Response:**
```json
{
  "success": true,
  "message": "Content item deleted successfully"
}
```

---

### Bulk Actions
Perform bulk operations on multiple content items.

**Endpoint:** `POST /api/admin/content/{modelId}/bulk`

**Request Body:**
```json
{
  "action": "publish",
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Available Actions:**
- `publish`: Publish selected items
- `unpublish`: Unpublish selected items
- `delete`: Delete selected items
- `update`: Update fields on selected items

**Response:**
```json
{
  "success": true,
  "count": 3,
  "message": "3 items published successfully"
}
```

---

### Restore Version
Restore a previous version of a content item.

**Endpoint:** `POST /api/admin/content/{modelId}/{itemId}/restore`

**Request Body:**
```json
{
  "versionId": "version-uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "modelId": "home-hero",
  "data": {...},
  "version": 3,
  "restoredFrom": 1
}
```

---

## File Upload

Files can be uploaded as part of content creation/update using multipart/form-data.

**Supported File Types:**
- Images: jpg, jpeg, png, gif, webp, svg
- Videos: mp4, webm, mov
- Documents: pdf, doc, docx

**Max File Size:** 10MB

**Storage:** Files are stored in `/public/uploads/` directory

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": {
    "title": "Title is required",
    "email": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "You must be logged in to access this resource"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Content item not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Read operations:** 100 requests per minute
- **Write operations:** 30 requests per minute
- **File uploads:** 10 requests per minute

---

## Versioning

The API uses semantic versioning. The current version is **v1**.

All endpoints are prefixed with `/api/admin/` for admin operations.

---

## Best Practices

1. **Use pagination** for large datasets
2. **Implement caching** on the client side
3. **Handle errors gracefully** with proper error messages
4. **Validate data** before sending to the API
5. **Use bulk operations** for multiple items
6. **Clean up uploaded files** when content is deleted
7. **Use optimistic updates** for better UX

---

## Examples

### JavaScript/TypeScript
```typescript
// Fetch content items
const response = await fetch('/api/admin/content/home-hero?page=1&limit=10');
const data = await response.json();

// Create content with file upload
const formData = new FormData();
formData.append('title', 'New Hero');
formData.append('backgroundImage', fileInput.files[0]);

const response = await fetch('/api/admin/content/home-hero', {
  method: 'POST',
  body: formData,
});
```

### cURL
```bash
# Get content items
curl -X GET "http://localhost:3000/api/admin/content/home-hero?page=1" \
  -H "Cookie: next-auth.session-token=..."

# Create content
curl -X POST "http://localhost:3000/api/admin/content/home-hero" \
  -H "Cookie: next-auth.session-token=..." \
  -F "title=New Hero" \
  -F "backgroundImage=@/path/to/image.jpg"
```
