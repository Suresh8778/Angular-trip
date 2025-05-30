import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
})
export class BookComponent implements OnInit {
  bookings: any[] = [];
  pagedBookings: any[] = [];

  selectedBookingIds: Set<string> = new Set();
  selectAll = false;

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  message = '';

  constructor(private svc: BookingService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.getAll().subscribe({
      next: (bs) => {
        this.bookings = bs.slice().reverse();
        this.totalPages = Math.ceil(this.bookings.length / this.pageSize);
        this.currentPage = 1;
        this.selectAll = false;
        this.selectedBookingIds.clear();
        this.setPagedBookings();
      },
      error: () => (this.message = 'Load failed'),
    });
  }

  setPagedBookings() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedBookings = this.bookings.slice(start, end);
  }

  goToPage(page: number, event?: Event) {
    if (event) event.preventDefault();
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.setPagedBookings();

    this.selectAll = false;
    this.selectedBookingIds.clear();
  }

  get visiblePages(): number[] {
    const pages = [];
    const maxPagesToShow = 3;
    const start = Math.max(1, this.currentPage - 1);
    const end = Math.min(this.totalPages, start + maxPagesToShow - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  handleCheckboxChange(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedBookingIds.add(id);
    } else {
      this.selectedBookingIds.delete(id);
      this.selectAll = false;
    }
  }

  toggleSelectAll() {
    if (this.selectAll) {
      this.pagedBookings.forEach((b) => this.selectedBookingIds.add(b._id));
    } else {
      this.pagedBookings.forEach((b) => this.selectedBookingIds.delete(b._id));
    }
  }

  deleteBooking(id: string) {
    if (!this.selectedBookingIds.has(id)) {
      alert('Please select the checkbox before deleting this booking.');
      return;
    }

    if (confirm('Are you sure you want to delete this booking?')) {
      this.svc.deleteBooking(id).subscribe({
        next: () => {
          this.bookings = this.bookings.filter((b) => b._id !== id);
          this.selectedBookingIds.delete(id);
          this.totalPages = Math.ceil(this.bookings.length / this.pageSize);
          if (this.currentPage > this.totalPages)
            this.currentPage = this.totalPages;
          this.setPagedBookings();
        },
        error: (err) => (this.message = err.error?.message || 'Delete failed'),
      });
    }
  }

  deleteSelectedBookings() {
    if (this.selectedBookingIds.size === 0) {
      alert('Please select at least one booking to delete.');
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${this.selectedBookingIds.size} selected bookings?`
      )
    ) {
      const idsToDelete = Array.from(this.selectedBookingIds);

      idsToDelete.forEach((id) => {
        this.svc.deleteBooking(id).subscribe({
          next: () => {
            this.bookings = this.bookings.filter((b) => b._id !== id);
            this.selectedBookingIds.delete(id);
            this.totalPages = Math.ceil(this.bookings.length / this.pageSize);
            if (this.currentPage > this.totalPages)
              this.currentPage = this.totalPages;
            this.setPagedBookings();
          },
          error: (err) =>
            (this.message = err.error?.message || 'Delete failed'),
        });
      });

      this.selectAll = false;
      this.selectedBookingIds.clear();
    }
  }

  exportToCSV() {
    if (this.selectedBookingIds.size === 0) {
      alert('Please select at least one booking to export.');
      return;
    }

    const selectedBookings = this.bookings.filter((b) =>
      this.selectedBookingIds.has(b._id)
    );

    const exportData = selectedBookings.map((b) => ({
      Email: b.email || 'N/A',
      Trip: Array.isArray(b.tripPlace)
        ? b.tripPlace.join(', ')
        : b.tripPlace || 'N/A',
      Date: new Date(b.bookingDate).toLocaleDateString(),
      Persons: b.persons || 1,
      Price: b.totalPrice,
    }));

    const csv = this.convertToCSV(exportData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const fileName = `SelectedBookings_${
      new Date().toISOString().split('T')[0]
    }.csv`;

    FileSaver.saveAs(blob, fileName);
  }

  private convertToCSV(objArray: any[]): string {
    if (!objArray.length) return '';

    const headers = Object.keys(objArray[0]);
    const rows = objArray.map((obj) =>
      headers
        .map((field) => {
          let value = obj[field] ?? '';
          if (typeof value === 'string') {
            value = value.replace(/"/g, '""');
            if (/("|,|\n)/.test(value)) value = `"${value}"`;
          }
          return value;
        })
        .join(',')
    );

    return headers.join(',') + '\r\n' + rows.join('\r\n');
  }

  // Helper method for template to check arrays
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  cleanTripPlace(tripPlace: any): string {
    if (Array.isArray(tripPlace)) {
      // Remove duplicates from array
      const uniqueTrips = Array.from(new Set(tripPlace));
      return uniqueTrips.join(', ');
    } else if (typeof tripPlace === 'string') {
      // If string, split by comma, remove duplicates, join again
      const tripsArray = tripPlace.split(',').map((s) => s.trim());
      const uniqueTrips = Array.from(new Set(tripsArray));
      return uniqueTrips.join(', ');
    }
    return 'N/A';
  }
}
