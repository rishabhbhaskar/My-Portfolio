/* Rishabh's SAP Portfolio - Dynamic Scripting & Real Functional/B1 Projects Data */

// Real Enterprise SAP Functional, Support & SAP Business One (SAP B1) Projects Data
const sapProjects = [
  {
    id: 'proj-sap-b1-core',
    category: 'sap-b1',
    client: 'SME Manufacturing & Distribution',
    tag: 'SAP Business One (SAP B1)',
    title: 'SAP B1 Implementation, Customization & Functional Support',
    summary: 'End-to-end SAP Business One (version for SAP HANA) implementation and support across Financials, Sales (AR), Purchasing (AP), Inventory, MRP, and Production.',
    tech: ['SAP B1 HANA', 'Formatted Searches (FMS)', 'Crystal Reports', 'UDF/UDT/UDO', 'B1 DI API'],
    details: {
      problem: 'Mid-sized manufacturing enterprise required automated inventory valuation, multi-branch financial reporting, and customized approval workflows in SAP Business One.',
      solution: 'Configured core SAP B1 modules, created custom User-Defined Fields (UDF), Tables (UDT), and Objects (UDO). Developed Formatted Searches (FMS) for dynamic pricing and Crystal Reports for executive dashboards.',
      deliverables: [
        'Complete SAP B1 Financials, AR/AP, and Stock Module Setup',
        'Custom Formatted Searches (FMS) & SQL/HANA Database Queries',
        'Crystal Reports Suite: Sales Register, Stock Valuation & Aging',
        'User-Defined Objects (UDO) & Transaction Notification Validation'
      ],
      codeSnippet: `/* SAP B1 Transaction Notification SP Snippet (HANA SQL) */
CREATE PROCEDURE SBO_SP_TransactionNotification
(
    IN object_type nvarchar(30),
    IN transaction_type nchar(1),
    IN num_of_cols_in_key int,
    IN list_of_key_cols_tab_del nvarchar(255),
    IN list_of_cols_val_tab_del nvarchar(255),
    OUT error int,
    OUT error_message nvarchar(200)
)
LANGUAGE SQLSCRIPT AS
BEGIN
    error := 0;
    error_message := '';

    -- Validate Sales Order (ObjType = 17) Tax Code
    IF :object_type = '17' AND (:transaction_type = 'A' OR :transaction_type = 'U') THEN
        IF EXISTS (SELECT T1."ItemCode" FROM ORDR T0 
                   INNER JOIN RDR1 T1 ON T0."DocEntry" = T1."DocEntry"
                   WHERE T0."DocEntry" = :list_of_cols_val_tab_del 
                     AND (T1."TaxCode" IS NULL OR T1."TaxCode" = '')) THEN
            error := 1001;
            error_message := 'SAP B1 Alert: Tax Code cannot be empty in Sales Order line items!';
        END IF;
    END IF;
END;`
    }
  },
  {
    id: 'proj-b1-service-layer',
    category: 'sap-b1',
    client: 'E-Commerce & ERP Integration',
    tag: 'SAP B1 Service Layer & B1iF',
    title: 'SAP B1 Service Layer & B1iF E-Commerce Integration Gateway',
    summary: 'Built real-time REST API integration between SAP Business One (HANA Service Layer) and external Web/E-commerce portals using SAP B1i Framework.',
    tech: ['SAP B1 Service Layer', 'B1i Framework (B1iF)', 'REST OData API', 'JSON', 'C# .NET SDK'],
    details: {
      problem: 'Online B2B orders placed on web portal were manually re-entered into SAP B1, leading to delay in order fulfillment and stock sync issues.',
      solution: 'Developed automated integration pipelines using SAP B1 Service Layer REST APIs and B1i Framework (B1iF). Synchronized Master Data (Items, BP) and posted Sales Orders automatically.',
      deliverables: [
        'Bi-directional REST API integration via SAP B1 Service Layer',
        'Automated Item Stock & Price sync to Web Store every 15 mins',
        'Auto-creation of AR Invoices & Incoming Payments',
        'Error logging & alert notification workflow'
      ],
      codeSnippet: `// C# .NET SDK / Service Layer REST Call Snippet
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;

public async Task<string> CreateB1SalesOrderAsync(string b1ServiceLayerUrl, string sessionId, object salesOrderData)
{
    using (var client = new HttpClient())
    {
        client.DefaultRequestHeaders.Add("Cookie", $"B1SESSION={sessionId}");
        var jsonContent = new StringContent(JsonConvert.SerializeObject(salesOrderData), Encoding.UTF8, "application/json");
        
        // Post to B1 Service Layer Orders Endpoint
        var response = await client.PostAsync($"{b1ServiceLayerUrl}/Orders", jsonContent);
        return await response.Content.ReadAsStringAsync();
    }
}`
    }
  },
  {
    id: 'proj-eagle',
    category: 'support',
    client: 'Eagle Enterprise',
    tag: 'SAP SD/MM Support & Customization',
    title: 'Eagle Enterprise - SAP SD/MM Post-Go-Live Support & Customization',
    summary: 'Handled end-to-end SAP SD and MM functional support for Eagle Enterprise, including custom pricing procedures, Z-reports for sales tracking, and user exit enhancements.',
    tech: ['SAP SD', 'SAP MM', 'Custom Z-Reports', 'Pricing Procedures', 'L2/L3 Support'],
    details: {
      problem: 'Eagle Enterprise faced complex pricing variations across regions and required real-time tracking for pending sales orders and inventory movements.',
      solution: 'Provided continuous L2/L3 functional support. Designed custom pricing determination routines, built Z-reports for order lifecycle tracking, and configured automatic output determination for invoices.',
      deliverables: [
        'Custom ALV Reports: `ZSD_SO_TRACKING` & `ZMM_PO_STATUS`',
        'Custom Pricing Condition Types and Access Sequences',
        'L2/L3 Ticket Resolution under strict SLAs',
        'Custom tax invoice layout and GST determination'
      ],
      codeSnippet: `/* Eagle Custom ALV Report Snippet (ZSD_SO_TRACKING) */
REPORT zsd_so_tracking.

TABLES: vbak, vbap, kna1.

TYPES: BEGIN OF ty_out,
         vbeln TYPE vbak-vbeln,
         erdat TYPE vbak-erdat,
         kunnr TYPE vbak-kunnr,
         name1 TYPE kna1-name1,
         netwr TYPE vbak-netwr,
         waerk TYPE vbak-waerk,
       END OF ty_out.

DATA: gt_out TYPE TABLE OF ty_out,
      gw_out TYPE ty_out.

SELECT-OPTIONS: s_vbeln FOR vbak-vbeln,
                s_erdat FOR vbak-erdat.

START-OF-SELECTION.
  SELECT a~vbeln, a~erdat, a~kunnr, b~name1, a~netwr, a~waerk
    FROM vbak AS a
    INNER JOIN kna1 AS b ON a~kunnr = b~kunnr
    INTO TABLE @gt_out
    WHERE a~vbeln IN @s_vbeln
      AND a~erdat IN @s_erdat.

  " Display interactive ALV Grid
  cl_salv_table=>factory(
    IMPORTING r_salv_table = DATA(lo_alv)
    CHANGING  t_table      = gt_out ).
  lo_alv->display( ).`
    }
  },
  {
    id: 'proj-spartan',
    category: 'customization',
    tag: 'Order-to-Cash & Custom Reports',
    client: 'Spartan Industries',
    title: 'Spartan Industries - Order-to-Cash (O2C) & Management Reports',
    summary: 'Delivered complete functional support and customization for Spartan Industries, including credit control configuration, STO processes, and executive sales reports.',
    tech: ['Order-to-Cash (O2C)', 'Credit Mgmt', 'STO Config', 'BADI', 'ALV Reports'],
    details: {
      problem: 'Spartan Industries needed tight control over customer credit limits and automated Stock Transfer Order (STO) tracking between plant locations.',
      solution: 'Configured Automatic Credit Control with custom BADI checks (`BADI_SD_CM`), customized STO movement types (351/101), and built executive sales summary reports.',
      deliverables: [
        'Automatic Credit Management & Blocked Order release workflow',
        'Stock Transfer Order (STO) plant-to-plant customization',
        'Executive Sales & Pending Delivery ALV Report (`ZSPARTAN_SALES`)',
        'End-User training manuals and operational documentation'
      ],
      codeSnippet: `/* Spartan Credit Limit Check BADI Enhancement */
METHOD if_ex_badi_sd_cm~credit_limit_check.
  IF im_credit_account-credit_limit < im_order_value.
    " Block Sales Order for Credit Exceeded
    ch_blocked = abap_true.
    MESSAGE 'Credit Limit Exceeded for Customer' TYPE 'W'.
  ENDIF.
ENDMETHOD.`
    }
  },
  {
    id: 'proj-sdbio',
    category: 'support',
    tag: 'SAP MM/SD Diagnostics Support',
    client: 'SD Bio (SD Biosensor)',
    title: 'SD Bio - Healthcare MM/SD Functional Support & Batch Management',
    summary: 'Provided ongoing SAP MM and SD functional support for SD Bio (SD Biosensor), implementing batch management, serial tracking for diagnostic kits, and custom GR reports.',
    tech: ['SAP MM', 'Batch Management', 'Serial Numbers', 'WMS Integration', 'GST'],
    details: {
      problem: 'SD Bio required strict batch expiry tracking and serial number management for diagnostic test kits, along with seamless Goods Receipt (GR) processing.',
      solution: 'Configured SAP MM Batch Management with shelf-life expiration date (SLED) checks, serial number profiles, and custom Z-reports for stock valuation and expiry alerts.',
      deliverables: [
        'Batch Management & Expiry Date (SLED) Configuration',
        'Goods Receipt & Serial Number Profile customization',
        'Custom Expiry Alert Report (`ZSDBIO_BATCH_EXPIRY`)',
        'Support for e-Invoicing & GST Return Data Reconciliation'
      ],
      codeSnippet: `/* SD Bio Batch Expiry Alert Logic */
REPORT zsdbio_batch_mch1.

SELECT matnr, charg, vfdat, clabs
  FROM mch1 AS a
  INNER JOIN mchb AS b ON a~matnr = b~matnr AND a~charg = b~charg
  INTO TABLE @DATA(gt_batches)
  WHERE a~vfdat <= @( sy-datum + 30 ). " Alert for batches expiring in 30 days

WRITE: / 'Material', 15 'Batch', 30 'Expiry Date', 45 'Stock Qty'.
LOOP AT gt_batches INTO DATA(gw_b).
  WRITE: / gw_b-matnr, 15 gw_b-charg, 30 gw_b-vfdat, 45 gw_b-clabs.
ENDLOOP.`
    }
  },
  {
    id: 'proj-esskay',
    category: 'customization',
    tag: 'SAP Retail & SD Support',
    client: 'Esskay Beauty',
    title: 'Esskay Beauty - Promotional Pricing, Custom Reports & GST Integration',
    summary: 'Managed SAP SD functional support and customizations for Esskay Beauty Care, configuring promotional pricing schemes, custom sales analytics, and e-Way bill reports.',
    tech: ['SAP SD', 'Promotional Pricing', 'e-Way Bill Z-Report', 'Rebate Mgmt', 'GST'],
    details: {
      problem: 'Esskay Beauty operated multiple promotional pricing models and discount tiers for retail partners, requiring automated pricing condition techniques and e-Way bill programs.',
      solution: 'Configured custom condition types and access sequences for trade discounts, implemented customer rebate processing, and developed custom Z-programs for e-Way bill generation.',
      deliverables: [
        'Promotional Pricing Condition Tables & Access Sequences',
        'Custom e-Way Bill Data Extractor Z-Report (`ZESSKAY_EWAY`)',
        'Customer Rebate Agreements & Volume Settlement',
        '24/7 Functional Support & User Problem Resolution'
      ],
      codeSnippet: `/* Esskay Beauty e-Way Bill Data Extraction Program */
REPORT zesskay_eway_bill.

SELECT vbrk~vbeln, vbrk~fkdat, vbrk~kunrg, vbrk~netwr, likp~traid
  FROM vbrk
  INNER JOIN likp ON vbrk~vbeln = likp~vbeln
  INTO TABLE @DATA(gt_eway_data)
  WHERE vbrk~fkdat = @sy-datum.

" Export XML/JSON payload for e-Way Bill Portal
WRITE: / 'Total Billing Documents Extracted for e-Way Bill:', lines( gt_eway_data ).`
    }
  },
  {
    id: 'proj-reports',
    category: 'reports',
    tag: 'Customizations & ABAP Reports',
    client: 'Multi-Client Enterprise',
    title: 'Custom Z-Reports, BADIs & SmartForms / Adobe Forms Suite',
    summary: 'Engineered over 50+ custom Z-reports, ALV grids, user exits, BADIs, and custom PDF document layouts across Eagle, Spartan, SD Bio, and Esskay Beauty engagements.',
    tech: ['ALV Reports', 'BADI / User Exits', 'SmartForms', 'Adobe Forms', 'Module Pool'],
    details: {
      problem: 'Standard SAP reports lacked client-specific columns, audit trail filters, and branded layout designs required by business key stakeholders.',
      solution: 'Created tailored ALV report tools, custom T-Codes (`ZSD01`, `ZMM02`), SmartForms/Adobe Forms for delivery challans and tax invoices, and enhanced standard SAP transactions via BADIs.',
      deliverables: [
        '50+ Production Custom ALV Reports & Dialog Programs',
        'Custom T-Codes and Role Authorization Assignments',
        'SmartForms & Adobe Interactive Forms with QR Codes',
        'Performance Tuning & Index Optimization for heavy SAP tables'
      ],
      codeSnippet: `/* SmartForm Call Function Snippet */
CALL FUNCTION 'SSF_FUNCTION_MODULE_NAME'
  EXPORTING  formname           = 'ZSD_TAX_INVOICE'
  IMPORTING  fm_name            = lv_fm_name.

CALL FUNCTION lv_fm_name
  EXPORTING  is_header          = gw_vbrk
  TABLES     ot_items           = gt_vbrp. `
    }
  }
];

// DOM Load Event
document.addEventListener('DOMContentLoaded', () => {
  renderProjects('all');
  initFilterTabs();
  initCounters();
  initHeaderScroll();
  initContactForm();
  initModal();
});

// Render Projects Cards
function renderProjects(filterCategory) {
  const container = document.getElementById('projectsGrid');
  if (!container) return;

  const filtered = filterCategory === 'all' 
    ? sapProjects 
    : sapProjects.filter(p => p.category === filterCategory);

  container.innerHTML = filtered.map(p => `
    <div class="project-card" data-category="${p.category}">
      <div>
        <span class="project-tag">${p.tag}</span>
        <h4 style="color: var(--accent-cyan); font-size: 0.85rem; font-weight: 700; margin-bottom: 4px; text-transform: uppercase;">Client: ${p.client}</h4>
        <h3>${p.title}</h3>
        <p>${p.summary}</p>
        <div class="project-tech-stack">
          ${p.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
        </div>
      </div>
      <button class="btn-card-details" onclick="openProjectModal('${p.id}')">
        <i class="fa-solid fa-circle-info"></i> View Details & Code/Logic
      </button>
    </div>
  `).join('');
}

// Filter Tabs Event Handler
function initFilterTabs() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderProjects(filter);
    });
  });
}

// Statistics Counter Animation
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const speed = 200;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const inc = target / speed;

        const updateCount = () => {
          count += inc;
          if (count < target) {
            counter.innerText = Math.ceil(count);
            setTimeout(updateCount, 15);
          } else {
            counter.innerText = target + '+';
          }
        };

        updateCount();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// Header Sticky Scroll Effect
function initHeaderScroll() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '70px';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = '#070d19';
      navLinks.style.padding = '20px';
    });
  }
}

// Project Detail Modal Handler
function initModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

function openProjectModal(projectId) {
  const project = sapProjects.find(p => p.id === projectId);
  if (!project) return;

  const modalBody = document.getElementById('modalBody');
  const modal = document.getElementById('projectModal');

  modalBody.innerHTML = `
    <span class="project-tag" style="margin-bottom: 8px; display: inline-block;">${project.tag}</span>
    <h4 style="color: var(--accent-cyan); font-size: 0.9rem; margin-bottom: 4px;">CLIENT / ENGAGEMENT: ${project.client}</h4>
    <h2 style="font-size: 1.8rem; margin-bottom: 16px;">${project.title}</h2>
    
    <div style="margin-bottom: 20px;">
      <h4 style="color: var(--accent-cyan); margin-bottom: 6px;"><i class="fa-solid fa-triangle-exclamation"></i> Business & Support Challenge</h4>
      <p style="color: var(--text-muted); font-size: 0.95rem;">${project.details.problem}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h4 style="color: var(--accent-cyan); margin-bottom: 6px;"><i class="fa-solid fa-lightbulb"></i> Functional Solution & Customization</h4>
      <p style="color: var(--text-muted); font-size: 0.95rem;">${project.details.solution}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h4 style="color: var(--accent-cyan); margin-bottom: 8px;"><i class="fa-solid fa-list-check"></i> Key Deliverables & Reports</h4>
      <ul style="padding-left: 20px; color: var(--text-muted); font-size: 0.9rem;">
        ${project.details.deliverables.map(d => `<li style="margin-bottom: 4px;">${d}</li>`).join('')}
      </ul>
    </div>

    <div>
      <h4 style="color: var(--accent-cyan); margin-bottom: 8px;"><i class="fa-solid fa-code"></i> Code / Query / Service Layer Logic Snippet</h4>
      <pre class="modal-code-block"><code>${escapeHtml(project.details.codeSnippet)}</code></pre>
    </div>
  `;

  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  if (modal) modal.classList.remove('active');
}

// Helper HTML Escaper
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
}

// Contact Form Handler
function initContactForm() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Show Toast Notification
      toast.classList.add('show');
      form.reset();

      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    });
  }
}
