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
} from '../cards';

export const AllEntitiesWidget = () => {
  return (
    <div className="space-y-6">
      {/* Jobs Section */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Jobs</h3>
          <p className="text-[12px] text-[#6B7280]">Scheduled work orders</p>
        </div>
        <div className="space-y-3">
          <JobCard
            title="Roof Replacement - Main Building"
            customer="Sarah Johnson"
            organization="Johnson Properties LLC"
            scheduledDate="Feb 25, 2026"
            scheduledTime="9:00 AM"
            technician="Mike Davis"
            priority="High"
          />
          <JobCard
            title="Gutter Repair Service"
            customer="Karl Hunter"
            scheduledDate="Feb 22, 2026"
            scheduledTime="2:00 PM"
            technician="Tom Wilson"
            priority="Medium"
          />
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Projects</h3>
          <p className="text-[12px] text-[#6B7280]">Ongoing construction projects</p>
        </div>
        <div className="space-y-3">
          <ProjectCard
            projectName="Downtown Office Complex Renovation"
            customer="Metro Real Estate"
            organization="Metro Holdings Inc"
            startDate="Jan 15, 2026"
            endDate="Apr 30, 2026"
            projectManager="James Smith"
            status="In Progress"
          />
          <ProjectCard
            projectName="Residential Community Build"
            customer="Green Valley HOA"
            startDate="Mar 1, 2026"
            endDate="Aug 15, 2026"
            projectManager="Lisa Brown"
            status="Planning"
          />
        </div>
      </div>

      {/* Customers Section */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Customers</h3>
          <p className="text-[12px] text-[#6B7280]">Customer database</p>
        </div>
        <div className="space-y-3">
          <CustomerCard
            customerName="Sarah Johnson"
            organization="Johnson Properties LLC"
            phone="(555) 123-4567"
            email="sarah@johnsonprops.com"
            serviceAddress="123 Main St, Springfield, IL"
            customerType="Commercial"
          />
          <CustomerCard
            customerName="Robert Martinez"
            phone="(555) 987-6543"
            email="robert.m@email.com"
            serviceAddress="456 Oak Ave, Springfield, IL"
            customerType="Residential"
          />
        </div>
      </div>

      {/* Organizations Section */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Organizations</h3>
          <p className="text-[12px] text-[#6B7280]">Business accounts</p>
        </div>
        <div className="space-y-3">
          <OrganizationCard
            organizationName="Metro Holdings Inc"
            primaryContact="David Chen"
            email="david@metroholdings.com"
            phone="(555) 234-5678"
            address="789 Business Blvd, Chicago, IL"
            accountStatus="Active"
          />
          <OrganizationCard
            organizationName="Green Valley HOA"
            primaryContact="Patricia White"
            email="info@greenvalleyhoa.org"
            phone="(555) 345-6789"
            address="100 Valley Rd, Springfield, IL"
            accountStatus="Active"
          />
        </div>
      </div>

      {/* Properties Section */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Properties</h3>
          <p className="text-[12px] text-[#6B7280]">Service locations</p>
        </div>
        <div className="space-y-3">
          <PropertyCard
            propertyName="Downtown Office Complex - Building A"
            owner="Metro Real Estate"
            organization="Metro Holdings Inc"
            propertyType="Commercial"
            accessNotes="Gate code: #1234, Contact security desk"
            activeStatus="Active"
          />
          <PropertyCard
            propertyName="Oakwood Industrial Park"
            owner="Industrial Properties LLC"
            propertyType="Industrial"
            activeStatus="Active"
          />
        </div>
      </div>

      {/* Vendors Section */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Vendors</h3>
          <p className="text-[12px] text-[#6B7280]">Supplier directory</p>
        </div>
        <div className="space-y-3">
          <VendorCard
            vendorName="ABC Building Supplies"
            contactPerson="John Stevens"
            phone="(555) 456-7890"
            email="john@abcsupplies.com"
            serviceCategory="Roofing Materials"
            vendorStatus="Preferred"
          />
          <VendorCard
            vendorName="Quality Tools & Equipment"
            contactPerson="Maria Garcia"
            phone="(555) 567-8901"
            email="maria@qualitytools.com"
            serviceCategory="Equipment Rental"
            vendorStatus="Active"
          />
        </div>
      </div>

      {/* Material Requests Section */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Material Requests</h3>
          <p className="text-[12px] text-[#6B7280]">Material procurement</p>
        </div>
        <div className="space-y-3">
          <MaterialRequestCard
            requestTitle="Shingles for Main Building"
            requestedBy="Mike Davis"
            relatedJobProject="Roof Replacement - Main Building"
            priority="Urgent"
            neededByDate="Feb 24, 2026"
            status="Approved"
          />
          <MaterialRequestCard
            requestTitle="Gutter Materials & Fasteners"
            requestedBy="Tom Wilson"
            relatedJobProject="Gutter Repair Service"
            priority="Medium"
            neededByDate="Feb 21, 2026"
            status="Ordered"
          />
        </div>
      </div>

      {/* Parts Section */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Parts</h3>
          <p className="text-[12px] text-[#6B7280]">Inventory management</p>
        </div>
        <div className="space-y-3">
          <PartsCard
            partName="Roofing Nail - 1.5 inch"
            skuCode="RN-1500"
            category="Fasteners"
            stockQuantity={850}
            reorderLevel={500}
            unitCost={0.15}
          />
          <PartsCard
            partName="Asphalt Shingle - Charcoal"
            skuCode="AS-CHAR-001"
            category="Roofing Materials"
            stockQuantity={45}
            reorderLevel={50}
            unitCost={28.99}
          />
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Services</h3>
          <p className="text-[12px] text-[#6B7280]">Service catalog</p>
        </div>
        <div className="space-y-3">
          <ServicesCard
            serviceName="Complete Roof Replacement"
            category="Roofing"
            duration="3-5 days"
            price={8500}
            assignedTeamType="Senior Installation Team"
            availabilityStatus="Available"
          />
          <ServicesCard
            serviceName="Emergency Leak Repair"
            category="Repair"
            duration="2-4 hours"
            price={450}
            assignedTeamType="Emergency Response Team"
            availabilityStatus="Available"
          />
        </div>
      </div>

      {/* Quotes Section */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Quotes</h3>
          <p className="text-[12px] text-[#6B7280]">Customer quotations</p>
        </div>
        <div className="space-y-3">
          <QuoteCard
            quoteTitle="QT-2026-0145"
            customer="Sarah Johnson"
            relatedJobProject="Roof Replacement - Main Building"
            totalAmount={12500}
            validUntil="Mar 15, 2026"
            status="Accepted"
          />
          <QuoteCard
            quoteTitle="QT-2026-0146"
            customer="Robert Martinez"
            relatedJobProject="Home Roof Inspection"
            totalAmount={350}
            validUntil="Feb 28, 2026"
            status="Sent"
          />
        </div>
      </div>

      {/* Invoices Section */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Invoices</h3>
          <p className="text-[12px] text-[#6B7280]">Billing and payments</p>
        </div>
        <div className="space-y-3">
          <InvoiceCard
            invoiceNumber="INV-2026-0234"
            customer="Metro Real Estate"
            relatedJobProject="Downtown Office Complex"
            amount={25000}
            dueDate="Mar 1, 2026"
            paymentStatus="Pending"
          />
          <InvoiceCard
            invoiceNumber="INV-2026-0235"
            customer="Karl Hunter"
            relatedJobProject="Gutter Repair Service"
            amount={1200}
            dueDate="Feb 15, 2026"
            paymentStatus="Overdue"
          />
        </div>
      </div>

      {/* Contracts Section */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Contracts</h3>
          <p className="text-[12px] text-[#6B7280]">Service agreements</p>
        </div>
        <div className="space-y-3">
          <ContractCard
            contractName="Annual Maintenance Agreement"
            customerOrg="Green Valley HOA"
            startDate="Jan 1, 2026"
            endDate="Dec 31, 2026"
            contractValue={45000}
            status="Active"
          />
          <ContractCard
            contractName="Multi-Property Service Contract"
            customerOrg="Metro Holdings Inc"
            startDate="Feb 1, 2026"
            endDate="Jan 31, 2027"
            contractValue={120000}
            status="Active"
          />
        </div>
      </div>

      {/* Assets Section */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Assets</h3>
          <p className="text-[12px] text-[#6B7280]">Equipment tracking</p>
        </div>
        <div className="space-y-3">
          <AssetCard
            assetName="Telescoping Ladder - 40ft"
            assetType="Ladder"
            location="Warehouse A"
            assignedTo="Mike Davis"
            serialNumber="TL-40-2024-0012"
            status="Active"
          />
          <AssetCard
            assetName="Pneumatic Nail Gun"
            assetType="Power Tool"
            location="Service Vehicle #3"
            assignedTo="Tom Wilson"
            serialNumber="PNG-2025-0089"
            status="Active"
          />
        </div>
      </div>
    </div>
  );
};
