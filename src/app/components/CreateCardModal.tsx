import { X } from 'lucide-react';
import { useState } from 'react';
import {
  JobCard,
  ProjectCard,
  CustomerCard,
  OrganizationCard,
  PropertyCard,
  VendorCard,
  MaterialRequestCard,
  PartsCard,
  ServicesCard,
  QuoteCard,
  InvoiceCard,
  ContractCard,
  AssetCard,
} from './cards';

interface CreateCardModalProps {
  cardType: string;
  onClose: () => void;
}

export const CreateCardModal = ({ cardType, onClose }: CreateCardModalProps) => {
  const [formData, setFormData] = useState<any>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderForm = () => {
    switch (cardType.toLowerCase()) {
      case 'job':
        return (
          <div className="space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1C1E21] mb-4">Create New Job</h3>
            <input
              type="text"
              placeholder="Job Title"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
            <input
              type="text"
              placeholder="Customer Name"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('customer', e.target.value)}
            />
            <input
              type="text"
              placeholder="Organization (Optional)"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('organization', e.target.value)}
            />
            <input
              type="date"
              placeholder="Scheduled Date"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
            />
            <input
              type="time"
              placeholder="Scheduled Time"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
            />
            <input
              type="text"
              placeholder="Technician"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('technician', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('priority', e.target.value)}
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        );

      case 'project':
        return (
          <div className="space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1C1E21] mb-4">Create New Project</h3>
            <input
              type="text"
              placeholder="Project Name"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('projectName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Customer"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('customer', e.target.value)}
            />
            <input
              type="text"
              placeholder="Organization (Optional)"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('organization', e.target.value)}
            />
            <input
              type="date"
              placeholder="Start Date"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
            <input
              type="date"
              placeholder="End Date"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />
            <input
              type="text"
              placeholder="Project Manager"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('projectManager', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        );

      case 'customer':
        return (
          <div className="space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1C1E21] mb-4">Create New Customer</h3>
            <input
              type="text"
              placeholder="Customer Name"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('customerName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Organization (Optional)"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('organization', e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <input
              type="text"
              placeholder="Service Address"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('serviceAddress', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('customerType', e.target.value)}
            >
              <option value="">Select Customer Type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
        );

      case 'organization':
      case 'org':
        return (
          <div className="space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1C1E21] mb-4">Create New Organization</h3>
            <input
              type="text"
              placeholder="Organization Name"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('organizationName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Primary Contact"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('primaryContact', e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('accountStatus', e.target.value)}
            >
              <option value="">Select Account Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        );

      case 'property':
        return (
          <div className="space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1C1E21] mb-4">Create New Property</h3>
            <input
              type="text"
              placeholder="Property Name / Address"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('propertyName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Owner / Customer"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('owner', e.target.value)}
            />
            <input
              type="text"
              placeholder="Organization (Optional)"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('organization', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
            >
              <option value="">Select Property Type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Mixed Use">Mixed Use</option>
            </select>
            <textarea
              placeholder="Access Notes (Optional)"
              rows={3}
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35] resize-none"
              onChange={(e) => handleInputChange('accessNotes', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('activeStatus', e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>
        );

      case 'vendor':
        return (
          <div className="space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1C1E21] mb-4">Create New Vendor</h3>
            <input
              type="text"
              placeholder="Vendor Name"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('vendorName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Contact Person"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('contactPerson', e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <input
              type="text"
              placeholder="Service Category"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('serviceCategory', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('vendorStatus', e.target.value)}
            >
              <option value="">Select Vendor Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Preferred">Preferred</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        );

      case 'material request':
      case 'material':
        return (
          <div className="space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1C1E21] mb-4">Create Material Request</h3>
            <input
              type="text"
              placeholder="Request Title"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('requestTitle', e.target.value)}
            />
            <input
              type="text"
              placeholder="Requested By"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('requestedBy', e.target.value)}
            />
            <input
              type="text"
              placeholder="Related Job / Project"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('relatedJobProject', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('priority', e.target.value)}
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
            <input
              type="date"
              placeholder="Needed By Date"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('neededByDate', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Ordered">Ordered</option>
              <option value="Received">Received</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        );

      case 'part':
      case 'parts':
        return (
          <div className="space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1C1E21] mb-4">Create New Part</h3>
            <input
              type="text"
              placeholder="Part Name"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('partName', e.target.value)}
            />
            <input
              type="text"
              placeholder="SKU / Code"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('skuCode', e.target.value)}
            />
            <input
              type="text"
              placeholder="Category"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('category', e.target.value)}
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
            />
            <input
              type="number"
              placeholder="Reorder Level"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Unit Cost (Optional)"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('unitCost', e.target.value)}
            />
          </div>
        );

      case 'service':
      case 'services':
        return (
          <div className="space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1C1E21] mb-4">Create New Service</h3>
            <input
              type="text"
              placeholder="Service Name"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('serviceName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Category"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('category', e.target.value)}
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2-4 hours)"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('duration', e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('price', e.target.value)}
            />
            <input
              type="text"
              placeholder="Assigned Team / Type"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('assignedTeamType', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('availabilityStatus', e.target.value)}
            >
              <option value="">Select Availability Status</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
              <option value="Seasonal">Seasonal</option>
              <option value="By Request">By Request</option>
            </select>
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1C1E21] mb-4">Create New Quote</h3>
            <input
              type="text"
              placeholder="Quote Title / Number"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('quoteTitle', e.target.value)}
            />
            <input
              type="text"
              placeholder="Customer"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('customer', e.target.value)}
            />
            <input
              type="text"
              placeholder="Related Job / Project (Optional)"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('relatedJobProject', e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Total Amount"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('totalAmount', e.target.value)}
            />
            <input
              type="date"
              placeholder="Valid Until"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('validUntil', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Viewed">Viewed</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        );

      case 'invoice':
        return (
          <div className="space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1C1E21] mb-4">Create New Invoice</h3>
            <input
              type="text"
              placeholder="Invoice Number"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
            />
            <input
              type="text"
              placeholder="Customer"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('customer', e.target.value)}
            />
            <input
              type="text"
              placeholder="Related Job / Project (Optional)"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('relatedJobProject', e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('amount', e.target.value)}
            />
            <input
              type="date"
              placeholder="Due Date"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
            >
              <option value="">Select Payment Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Partial">Partial</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        );

      case 'contract':
        return (
          <div className="space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1C1E21] mb-4">Create New Contract</h3>
            <input
              type="text"
              placeholder="Contract Name"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('contractName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Customer / Organization"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('customerOrg', e.target.value)}
            />
            <input
              type="date"
              placeholder="Start Date"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
            <input
              type="date"
              placeholder="End Date"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Contract Value"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('contractValue', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
              <option value="Terminated">Terminated</option>
              <option value="Renewed">Renewed</option>
            </select>
          </div>
        );

      case 'asset':
        return (
          <div className="space-y-4">
            <h3 className="text-[18px] font-semibold text-[#1C1E21] mb-4">Create New Asset</h3>
            <input
              type="text"
              placeholder="Asset Name"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('assetName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Asset Type"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('assetType', e.target.value)}
            />
            <input
              type="text"
              placeholder="Location / Property"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
            <input
              type="text"
              placeholder="Assigned To"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('assignedTo', e.target.value)}
            />
            <input
              type="text"
              placeholder="Serial Number / ID"
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('serialNumber', e.target.value)}
            />
            <select
              className="w-full px-3 py-2 border border-[#E6E8EC] rounded-lg text-[14px] focus:outline-none focus:border-[#FF6B35]"
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="In Repair">In Repair</option>
              <option value="Retired">Retired</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        );

      default:
        return <p className="text-[#6B7280]">Unknown card type: {cardType}</p>;
    }
  };

  const renderPreview = () => {
    const hasData = Object.keys(formData).length > 0;
    if (!hasData) return null;

    switch (cardType.toLowerCase()) {
      case 'job':
        if (formData.title) {
          return (
            <JobCard
              title={formData.title || 'New Job'}
              customer={formData.customer || 'Customer Name'}
              organization={formData.organization}
              scheduledDate={formData.scheduledDate || 'Date TBD'}
              scheduledTime={formData.scheduledTime || 'Time TBD'}
              technician={formData.technician || 'Unassigned'}
              priority={formData.priority || 'Medium'}
            />
          );
        }
        break;

      case 'project':
        if (formData.projectName) {
          return (
            <ProjectCard
              projectName={formData.projectName || 'New Project'}
              customer={formData.customer || 'Customer Name'}
              organization={formData.organization}
              startDate={formData.startDate || 'Start TBD'}
              endDate={formData.endDate || 'End TBD'}
              projectManager={formData.projectManager || 'Unassigned'}
              status={formData.status || 'Planning'}
            />
          );
        }
        break;

      case 'customer':
        if (formData.customerName) {
          return (
            <CustomerCard
              customerName={formData.customerName || 'Customer Name'}
              organization={formData.organization}
              phone={formData.phone || '(000) 000-0000'}
              email={formData.email || 'email@example.com'}
              serviceAddress={formData.serviceAddress || 'Address TBD'}
              customerType={formData.customerType || 'Residential'}
            />
          );
        }
        break;

      case 'organization':
      case 'org':
        if (formData.organizationName) {
          return (
            <OrganizationCard
              organizationName={formData.organizationName || 'Organization Name'}
              primaryContact={formData.primaryContact || 'Contact Name'}
              email={formData.email || 'email@example.com'}
              phone={formData.phone || '(000) 000-0000'}
              address={formData.address || 'Address TBD'}
              accountStatus={formData.accountStatus || 'Active'}
            />
          );
        }
        break;

      case 'property':
        if (formData.propertyName) {
          return (
            <PropertyCard
              propertyName={formData.propertyName || 'Property Name'}
              owner={formData.owner || 'Owner Name'}
              organization={formData.organization}
              propertyType={formData.propertyType || 'Residential'}
              accessNotes={formData.accessNotes}
              activeStatus={formData.activeStatus || 'Active'}
            />
          );
        }
        break;

      case 'vendor':
        if (formData.vendorName) {
          return (
            <VendorCard
              vendorName={formData.vendorName || 'Vendor Name'}
              contactPerson={formData.contactPerson || 'Contact Name'}
              phone={formData.phone || '(000) 000-0000'}
              email={formData.email || 'email@example.com'}
              serviceCategory={formData.serviceCategory || 'Category'}
              vendorStatus={formData.vendorStatus || 'Active'}
            />
          );
        }
        break;

      case 'material request':
      case 'material':
        if (formData.requestTitle) {
          return (
            <MaterialRequestCard
              requestTitle={formData.requestTitle || 'Request Title'}
              requestedBy={formData.requestedBy || 'Requester Name'}
              relatedJobProject={formData.relatedJobProject || 'Related Job/Project'}
              priority={formData.priority || 'Medium'}
              neededByDate={formData.neededByDate || 'Date TBD'}
              status={formData.status || 'Pending'}
            />
          );
        }
        break;

      case 'part':
      case 'parts':
        if (formData.partName) {
          return (
            <PartsCard
              partName={formData.partName || 'Part Name'}
              skuCode={formData.skuCode || 'SKU-000'}
              category={formData.category || 'Category'}
              stockQuantity={parseInt(formData.stockQuantity) || 0}
              reorderLevel={parseInt(formData.reorderLevel) || 0}
              unitCost={formData.unitCost ? parseFloat(formData.unitCost) : undefined}
            />
          );
        }
        break;

      case 'service':
      case 'services':
        if (formData.serviceName) {
          return (
            <ServicesCard
              serviceName={formData.serviceName || 'Service Name'}
              category={formData.category || 'Category'}
              duration={formData.duration || 'Duration TBD'}
              price={parseFloat(formData.price) || 0}
              assignedTeamType={formData.assignedTeamType || 'Team TBD'}
              availabilityStatus={formData.availabilityStatus || 'Available'}
            />
          );
        }
        break;

      case 'quote':
        if (formData.quoteTitle) {
          return (
            <QuoteCard
              quoteTitle={formData.quoteTitle || 'Quote #'}
              customer={formData.customer || 'Customer Name'}
              relatedJobProject={formData.relatedJobProject}
              totalAmount={parseFloat(formData.totalAmount) || 0}
              validUntil={formData.validUntil || 'Date TBD'}
              status={formData.status || 'Draft'}
            />
          );
        }
        break;

      case 'invoice':
        if (formData.invoiceNumber) {
          return (
            <InvoiceCard
              invoiceNumber={formData.invoiceNumber || 'INV-000'}
              customer={formData.customer || 'Customer Name'}
              relatedJobProject={formData.relatedJobProject}
              amount={parseFloat(formData.amount) || 0}
              dueDate={formData.dueDate || 'Date TBD'}
              paymentStatus={formData.paymentStatus || 'Pending'}
            />
          );
        }
        break;

      case 'contract':
        if (formData.contractName) {
          return (
            <ContractCard
              contractName={formData.contractName || 'Contract Name'}
              customerOrg={formData.customerOrg || 'Customer/Org'}
              startDate={formData.startDate || 'Start TBD'}
              endDate={formData.endDate || 'End TBD'}
              contractValue={parseFloat(formData.contractValue) || 0}
              status={formData.status || 'Pending'}
            />
          );
        }
        break;

      case 'asset':
        if (formData.assetName) {
          return (
            <AssetCard
              assetName={formData.assetName || 'Asset Name'}
              assetType={formData.assetType || 'Asset Type'}
              location={formData.location || 'Location TBD'}
              assignedTo={formData.assignedTo || 'Unassigned'}
              serialNumber={formData.serialNumber || 'SN-000'}
              status={formData.status || 'Active'}
            />
          );
        }
        break;
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E6E8EC]">
          <h2 className="text-[20px] font-semibold text-[#1C1E21]">Create {cardType}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F8F9FB] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-auto-hide">
          {/* Form */}
          {renderForm()}

          {/* Preview */}
          {renderPreview() && (
            <div className="mt-8">
              <h4 className="text-[14px] font-semibold text-[#1C1E21] mb-3">Preview</h4>
              <div className="bg-[#F8F9FB] rounded-xl p-4">
                {renderPreview()}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E6E8EC]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-medium text-[#6B7280] hover:text-[#1C1E21] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('Creating:', cardType, formData);
              onClose();
            }}
            className="px-6 py-2 text-[14px] font-medium text-white bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] rounded-lg transition-all duration-150"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};