'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Filter, X, Plus, Edit, Trash2, Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react';

// Dahabiya type definition
interface Dahabiya {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  pricePerDay: number;
  capacity: number;
  cabins?: number;
  crew?: number;
  length?: number;
  width?: number;
  yearBuilt?: number;
  mainImage?: string;
  gallery?: string[];
  specificationsImage?: string;
  videoUrl?: string;
  virtualTourUrl?: string;
  features: string[];
  amenities?: string[];
  activities?: string[];
  diningOptions?: string[];
  services?: string[];
  routes?: string[];
  highlights?: string[];
  category?: 'LUXURY' | 'DELUXE' | 'PREMIUM' | 'BOUTIQUE';
  isActive: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  documents?: PDFDocument[];
  createdAt: string;
  updatedAt: string;
}

interface PDFDocument {
  id?: string;
  name: string;
  type: 'FACTSHEET' | 'BROCHURE' | 'SPECIFICATION';
  url: string;
  size: number;
}

interface Amenity {
  id: string;
  name: string;
  icon?: string;
  isActive: boolean;
}

const DahabiyaManager: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
  // State for dahabiyas list and pagination
  const [dahabiyas, setDahabiyas] = useState<Dahabiya[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    featured: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State for dialogs
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentDahabiya, setCurrentDahabiya] = useState<Dahabiya | null>(null);
  const [amenitiesOptions, setAmenitiesOptions] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Fetch dahabiyas from API
  useEffect(() => {
    const fetchDahabiyas = async () => {
      try {
        setIsLoading(true);
        // Build query params
        const params = new URLSearchParams({
          page: (page + 1).toString(),
          limit: rowsPerPage.toString(),
          search: searchQuery,
          ...(filters.category && { category: filters.category }),
          ...(filters.status && { status: filters.status }),
          ...(filters.featured && { featured: filters.featured })
        });
        
        const response = await fetch(`/api/admin/dahabiyas?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch dahabiyas');
        }
        
        const data = await response.json();
        setDahabiyas(data.items || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching dahabiyas:', err);
        setError('Failed to load dahabiyas. Please try again later.');
        setDahabiyas([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDahabiyas();
  }, [searchQuery, filters, page, rowsPerPage]);

  // Fetch amenities for selection
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const res = await fetch('/api/admin/amenities');
        if (res.ok) {
          const data: Amenity[] = await res.json();
          setAmenitiesOptions(data.filter(a => a.isActive));
        }
      } catch (_) {}
    };
    fetchAmenities();
  }, []);
  
  // Handle filter changes
  const handleFilterChange = (filter: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      featured: ''
    });
    setSearchQuery('');
  };
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already handled by the useEffect with searchQuery as dependency
  };
  
  // Handle page change
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0); // Reset to first page
  };
  
  // Apply client-side filtering for better UX (optional)
  const filteredDahabiyas = useMemo(() => {
    return dahabiyas.filter(dahabiya => {
      const matchesSearch = searchQuery === '' || 
        dahabiya.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dahabiya.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !filters.category || dahabiya.category === filters.category;
      const matchesStatus = !filters.status || 
        (filters.status === 'active' && dahabiya.isActive) ||
        (filters.status === 'inactive' && !dahabiya.isActive);
      const matchesFeatured = !filters.featured || 
        (filters.featured === 'featured' && dahabiya.isFeatured);
      
      return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
    });
  }, [dahabiyas, searchQuery, filters]);
  
  // Handle edit dahabiya
  const handleEditDahabiya = (dahabiya: Dahabiya) => {
    setCurrentDahabiya(dahabiya);
    setSelectedAmenities(Array.isArray(dahabiya.amenities) ? dahabiya.amenities : []);
    setIsEditDialogOpen(true);
  };
  
  // Handle delete dahabiya
  const handleDeleteDahabiya = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dahabiya?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/dahabiyas/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete dahabiya');
      }
      
      // Refresh the list
      setDahabiyas(prev => prev.filter(d => d.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting dahabiya:', err);
      setError('Failed to delete dahabiya. Please try again.');
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = currentDahabiya ? 'PUT' : 'POST';
      const url = currentDahabiya 
        ? `/api/admin/dahabiyas/${currentDahabiya.id}`
        : '/api/admin/dahabiyas';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(currentDahabiya || {}),
          amenities: selectedAmenities,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save dahabiya');
      }
      
      const savedDahabiya = await response.json();
      
      if (currentDahabiya) {
        // Update existing dahabiya
        setDahabiyas(prev => 
          prev.map(d => d.id === savedDahabiya.id ? savedDahabiya : d)
        );
      } else {
        // Add new dahabiya
        setDahabiyas(prev => [savedDahabiya, ...prev]);
      }
      
      // Close dialog and reset form
      setIsEditDialogOpen(false);
      setCurrentDahabiya(null);
      setSelectedAmenities([]);
      setError(null);
    } catch (err) {
      console.error('Error saving dahabiya:', err);
      setError('Failed to save dahabiya. Please try again.');
    }
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Check if user is admin
  const isAdmin = session?.user?.role === 'ADMIN';
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dahabiya Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage your fleet of dahabiyas
          </p>
        </div>
        <Button onClick={() => {
          setCurrentDahabiya(null);
          setIsEditDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Dahabiya
        </Button>
      </div>
      
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search dahabiyas..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <Button
              variant="outline"
              onClick={() => setIsFilterDialogOpen(true)}
              className="shrink-0"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            {(filters.category || filters.status || filters.featured) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="shrink-0"
              >
                <X className="mr-2 h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>
          
          {/* Active filters */}
          {(filters.category || filters.status || filters.featured) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Category: {filters.category}
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Status: {filters.status}
                </span>
              )}
              {filters.featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Featured
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dahabiyas Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Dahabiyas</CardTitle>
              <CardDescription>
                {filteredDahabiyas.length} dahabiyas found
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={handleChangeRowsPerPage}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={rowsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : filteredDahabiyas.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No dahabiyas found. Try adjusting your search or filters.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price (per day)</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDahabiyas.map((dahabiya) => (
                  <TableRow key={dahabiya.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {dahabiya.mainImage && (
                          <img
                            src={dahabiya.mainImage}
                            alt={dahabiya.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <div>{dahabiya.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {dahabiya.shortDescription?.substring(0, 50)}{dahabiya.shortDescription?.length > 50 ? '...' : ''}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {dahabiya.category || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>{formatPrice(dahabiya.pricePerDay)}</TableCell>
                    <TableCell>{dahabiya.capacity} guests</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        dahabiya.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {dahabiya.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {dahabiya.isFeatured && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Featured
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/dahabiyas/${dahabiya.slug}`)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditDahabiya(dahabiya)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteDahabiya(dahabiya.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">
              {filteredDahabiyas.length === 0 ? 0 : page * rowsPerPage + 1}
            </span> to{' '}
            <span className="font-medium">
              {Math.min((page + 1) * rowsPerPage, filteredDahabiyas.length)}
            </span>{' '}
            of <span className="font-medium">{filteredDahabiyas.length}</span> dahabiyas
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= Math.ceil(filteredDahabiyas.length / rowsPerPage) - 1}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Dahabiyas</DialogTitle>
            <DialogDescription>
              Narrow down the list of dahabiyas by applying filters.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="LUXURY">Luxury</SelectItem>
                  <SelectItem value="DELUXE">Deluxe</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                  <SelectItem value="BOUTIQUE">Boutique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    className="h-4 w-4 text-primary"
                    checked={filters.status === ''}
                    onChange={() => handleFilterChange('status', '')}
                  />
                  <span>All</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    className="h-4 w-4 text-primary"
                    checked={filters.status === 'active'}
                    onChange={() => handleFilterChange('status', 'active')}
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    className="h-4 w-4 text-primary"
                    checked={filters.status === 'inactive'}
                    onChange={() => handleFilterChange('status', 'inactive')}
                  />
                  <span>Inactive</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  id="featured"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary"
                  checked={filters.featured === 'featured'}
                  onChange={(e) => 
                    handleFilterChange('featured', e.target.checked ? 'featured' : '')
                  }
                />
                <Label htmlFor="featured">Featured Only</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button onClick={() => setIsFilterDialogOpen(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit/Create Dahabiya Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentDahabiya ? 'Edit Dahabiya' : 'Add New Dahabiya'}
            </DialogTitle>
            <DialogDescription>
              {currentDahabiya 
                ? 'Update the dahabiya details below.' 
                : 'Fill in the details to add a new dahabiya to your fleet.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter dahabiya name"
                  value={currentDahabiya?.name || ''}
                  onChange={(e) => 
                    setCurrentDahabiya(prev => ({
                      ...prev!,
                      name: e.target.value
                    }))
                  }
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="dahabiya-name"
                  value={currentDahabiya?.slug || ''}
                  onChange={(e) => 
                    setCurrentDahabiya(prev => ({
                      ...prev!,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w-]+/g, '')
                    }))
                  }
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={currentDahabiya?.category || ''}
                  onValueChange={(value) => 
                    setCurrentDahabiya(prev => ({
                      ...prev!,
                      category: value as Dahabiya['category']
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LUXURY">Luxury</SelectItem>
                    <SelectItem value="DELUXE">Deluxe</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                    <SelectItem value="BOUTIQUE">Boutique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pricePerDay">Price per day (USD)</Label>
                <Input
                  id="pricePerDay"
                  type="number"
                  placeholder="0.00"
                  value={currentDahabiya?.pricePerDay || ''}
                  onChange={(e) => 
                    setCurrentDahabiya(prev => ({
                      ...prev!,
                      pricePerDay: Number(e.target.value)
                    }))
                  }
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="Number of guests"
                  value={currentDahabiya?.capacity || ''}
                  onChange={(e) => 
                    setCurrentDahabiya(prev => ({
                      ...prev!,
                      capacity: Number(e.target.value)
                    }))
                  }
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cabins">Number of Cabins</Label>
                <Input
                  id="cabins"
                  type="number"
                  placeholder="e.g., 5"
                  value={currentDahabiya?.cabins || ''}
                  onChange={(e) => 
                    setCurrentDahabiya(prev => ({
                      ...prev!,
                      cabins: Number(e.target.value)
                    }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mainImage">Main Image URL</Label>
                <Input
                  id="mainImage"
                  placeholder="https://example.com/image.jpg"
                  value={currentDahabiya?.mainImage || ''}
                  onChange={(e) => 
                    setCurrentDahabiya(prev => ({
                      ...prev!,
                      mainImage: e.target.value
                    }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL (optional)</Label>
                <Input
                  id="videoUrl"
                  placeholder="https://youtube.com/embed/..."
                  value={currentDahabiya?.videoUrl || ''}
                  onChange={(e) => 
                    setCurrentDahabiya(prev => ({
                      ...prev!,
                      videoUrl: e.target.value
                    }))
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="isActive"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary"
                  checked={currentDahabiya?.isActive ?? true}
                  onChange={(e) => 
                    setCurrentDahabiya(prev => ({
                      ...prev!,
                      isActive: e.target.checked
                    }))
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="isFeatured"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary"
                  checked={currentDahabiya?.isFeatured ?? false}
                  onChange={(e) => 
                    setCurrentDahabiya(prev => ({
                      ...prev!,
                      isFeatured: e.target.checked
                    }))
                  }
                />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setCurrentDahabiya(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {currentDahabiya ? 'Save Changes' : 'Create Dahabiya'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DahabiyaManager;
