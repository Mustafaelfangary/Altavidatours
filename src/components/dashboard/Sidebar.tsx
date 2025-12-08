import React from 'react';
import Link from 'next/link';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import HotelIcon from '@mui/icons-material/Hotel';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import SailingIcon from '@mui/icons-material/Sailing';
import ExploreIcon from '@mui/icons-material/Explore';
import PlaceIcon from '@mui/icons-material/Place';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const Sidebar: React.FC = () => {
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/dahabiyat">
          <ListItemIcon>
            <DirectionsBoatIcon />
          </ListItemIcon>
          <ListItemText primary="Dahabiyat" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/packages">
          <ListItemIcon>
            <HotelIcon />
          </ListItemIcon>
          <ListItemText primary="Packages" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/cruises">
          <ListItemIcon>
            <SailingIcon />
          </ListItemIcon>
          <ListItemText primary="Cruises" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/daily-tours">
          <ListItemIcon>
            <ExploreIcon />
          </ListItemIcon>
          <ListItemText primary="Daily Tours" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/excursions">
          <ListItemIcon>
            <PlaceIcon />
          </ListItemIcon>
          <ListItemText primary="Excursions" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/bookings">
          <ListItemIcon>
            <BookOnlineIcon />
          </ListItemIcon>
          <ListItemText primary="Bookings" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/blog">
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Blog" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/testimonials">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Testimonials" />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/sections">
          <ListItemIcon>
            <ViewModuleIcon />
          </ListItemIcon>
          <ListItemText primary="Homepage Sections" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/homepage-settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Homepage Settings" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Content Settings" />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/site-settings">
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText primary="Site Settings" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/navigation">
          <ListItemIcon>
            <MenuIcon />
          </ListItemIcon>
          <ListItemText primary="Navigation" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/dashboard/seo">
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary="SEO Settings" />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default Sidebar; 