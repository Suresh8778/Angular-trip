import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  pagedUsers: User[] = [];

  selectedUserIds: Set<string> = new Set(); 
  selectAll = false;

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
    
        this.users = data;
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        this.setPagedUsers();
      },
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  setPagedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }

  changePage(page: number, event?: Event) {
    if (event) event.preventDefault();
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.setPagedUsers();
    this.selectAll = false;
    this.selectedUserIds.clear();
  }
  get visiblePages(): number[] {
  const pages: number[] = [];
  const maxPagesToShow = 3;

  let start = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
  let end = start + maxPagesToShow - 1;

  if (end > this.totalPages) {
    end = this.totalPages;
    start = Math.max(1, end - maxPagesToShow + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}


  handleCheckboxChange(userId: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedUserIds.add(userId);
    } else {
      this.selectedUserIds.delete(userId);
      this.selectAll = false;
    }
  }

  toggleSelectAll() {
    if (this.selectAll) {
      this.pagedUsers.forEach(user => this.selectedUserIds.add(user._id));
    } else {
      this.pagedUsers.forEach(user => this.selectedUserIds.delete(user._id));
    }
  }

  deleteUser(id: string) {
    if (!this.selectedUserIds.has(id)) {
      alert('Please select the checkbox before deleting this user.');
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user._id !== id);
          this.selectedUserIds.delete(id);
          this.totalPages = Math.ceil(this.users.length / this.pageSize);
          if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
          this.setPagedUsers();
        },
        error: (err) => console.error('Error deleting user:', err)
      });
    }
  }

  deleteSelectedUsers() {
    if (this.selectedUserIds.size === 0) {
      alert('Please select at least one user to delete.');
      return;
    }

    if (confirm('Are you sure you want to delete selected users?')) {
      const idsToDelete = Array.from(this.selectedUserIds);

      idsToDelete.forEach(id => {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.users = this.users.filter(user => user._id !== id);
            this.selectedUserIds.delete(id);
            this.totalPages = Math.ceil(this.users.length / this.pageSize);
            if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
            this.setPagedUsers();
          },
          error: (err) => console.error('Error deleting user:', err)
        });
      });

      this.selectAll = false;
      this.selectedUserIds.clear();
    }
  }

  exportToCSV(): void {
    if (this.selectedUserIds.size === 0) {
      alert('Please select at least one user to export.');
      return;
    }

    const selectedUsers = this.users.filter(user => this.selectedUserIds.has(user._id));

    const exportData = selectedUsers.map(user => ({
      Name: user.name,
      Email: user.email,
      Gender: user.gender || '-',
      Address: user.address || '-'
    }));

    const csv = this.convertToCSV(exportData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const fileName = `SelectedUsers_${new Date().toISOString().split('T')[0]}.csv`;

    FileSaver.saveAs(blob, fileName);
  }

  private convertToCSV(objArray: any[]): string {
    if (!objArray || !objArray.length) return '';

    const headers = Object.keys(objArray[0]);
    const rows = objArray.map(obj =>
      headers.map(fieldName => {
        let value = obj[fieldName] ?? '';
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""');
          if (value.search(/("|,|\n)/g) >= 0) {
            value = `"${value}"`;
          }
        }
        return value;
      }).join(',')
    );

    return headers.join(',') + '\r\n' + rows.join('\r\n');
  }
}
