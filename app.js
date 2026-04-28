// State Management
const STORAGE_KEYS = {
  TRANSACTIONS: 'bf_transactions',
  SUBSCRIPTIONS: 'bf_subscriptions',
  CUSTOM_CATEGORIES: 'bf_custom_categories'
};

let transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || [];
let subscriptions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS)) || [];
let customCategories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES)) || {};

let transSortBy = 'date';
let subSortBy = 'nextDate';

// Calendar State
let calendarDate = new Date();

function saveData() {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
  localStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(customCategories));
}

// Helpers
const getServiceLogo = (name, category = '') => {
  const n = name.toLowerCase();
  let domain = '';
  
  const colors = getCategoryColor(category, name);
  const bgColor = colors.bg;
  const textColor = colors.text;
  
  // High-accuracy domain mapping
  if (n.includes('netflix')) domain = 'netflix.com';
  else if (n.includes('spotify')) domain = 'spotify.com';
  else if (n.includes('amazon') || n.includes('prime') || n.includes('aws')) domain = 'amazon.com';
  else if (n.includes('apple') || n.includes('icloud') || n.includes('music')) domain = 'apple.com';
  else if (n.includes('google') || n.includes('youtube') || n.includes('drive') || n.includes('workspace')) domain = 'google.com';
  else if (n.includes('microsoft') || n.includes('office') || n.includes('365') || n.includes('azure') || n.includes('xbox')) domain = 'microsoft.com';
  else if (n.includes('disney')) domain = 'disneyplus.com';
  else if (n.includes(' Hulu')) domain = 'hulu.com';
  else if (n.includes('hbo') || n.includes(' max')) domain = 'max.com';
  else if (n.includes('noon')) domain = 'noon.com';
  else if (n.includes('notion')) domain = 'notion.so';
  else if (n.includes('github')) domain = 'github.com';
  else if (n.includes('figma')) domain = 'figma.com';
  else if (n.includes('slack')) domain = 'slack.com';
  else if (n.includes('zoom')) domain = 'zoom.us';
  else if (n.includes('adobe') || n.includes('creative cloud')) domain = 'adobe.com';
  else if (n.includes('canva')) domain = 'canva.com';
  else if (n.includes('claude') || n.includes('anthropic')) domain = 'anthropic.com';
  else if (n.includes('chatgpt') || n.includes('openai')) domain = 'openai.com';
  else if (n.includes('perplexity')) domain = 'perplexity.ai';
  else if (n.includes('midjourney')) domain = 'midjourney.com';
  else if (n.includes('linkedin')) domain = 'linkedin.com';
  else if (n.includes('ubereats') || n.includes('uber')) domain = 'uber.com';
  else if (n.includes('door dash') || n.includes('doordash')) domain = 'doordash.com';
  else if (n.includes('deliveroo')) domain = 'deliveroo.co.uk';
  else if (n.includes('careem')) domain = 'careem.com';
  else if (n.includes('instacart')) domain = 'instacart.com';
  else if (n.includes('steam')) domain = 'steampowered.com';
  else if (n.includes('playstation')) domain = 'playstation.com';
  else if (n.includes('nintendo')) domain = 'nintendo.com';
  else if (n.includes('shopify')) domain = 'shopify.com';
  else if (n.includes('dropbox')) domain = 'dropbox.com';
  
  if (domain) {
    return `<img src="https://www.google.com/s2/favicons?sz=128&domain=${domain}" 
      style="width: 2.8rem; height: 2.8rem; border-radius: 0.75rem; object-fit: contain; background: white; padding: 6px; border: 1px solid var(--slate-100); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: var(--shadow-sm);" 
      class="service-logo" 
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      alt="${name}">
      <div style="display: none; width: 2.8rem; height: 2.8rem; background: ${bgColor}; color: ${textColor}; border-radius: 0.75rem; align-items: center; justify-content: center; font-weight: 800; font-size: 1.125rem; border: 1px solid ${textColor}22;">${name.charAt(0).toUpperCase()}</div>`;
  }
  return `<div style="width: 2.8rem; height: 2.8rem; background: ${bgColor}; color: ${textColor}; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.125rem; border: 1px solid ${textColor}22;">${name.charAt(0).toUpperCase()}</div>`;
};

// Formatters
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const getCategoryColor = (category, name = '') => {
  const n = (name || '').toLowerCase();
  
  // 1. High-Priority Brand Overrides (Brand Identity) + URLs
  if (n.includes('chatgpt') || n.includes('openai')) return { bg: '#10a37f', text: '#ffffff', url: 'https://chat.openai.com' }; 
  if (n.includes('claude') || n.includes('anthropic')) return { bg: '#d97757', text: '#ffffff', url: 'https://claude.ai' }; 
  if (n.includes('notion')) return { bg: '#000000', text: '#ffffff', url: 'https://notion.so' }; 
  if (n.includes('netflix')) return { bg: '#e50914', text: '#ffffff', url: 'https://netflix.com' }; 
  if (n.includes('spotify')) return { bg: '#1db954', text: '#ffffff', url: 'https://spotify.com' }; 
  if (n.includes('amazon') || n.includes('prime')) return { bg: '#ff9900', text: '#000000', url: 'https://amazon.com' }; 
  if (n.includes('figma')) return { bg: '#f24e1e', text: '#ffffff', url: 'https://figma.com' }; 
  if (n.includes('youtube') || n.includes('google')) return { bg: '#4285f4', text: '#ffffff', url: 'https://google.com' }; 
  if (n.includes('microsoft') || n.includes('office')) return { bg: '#00a4ef', text: '#ffffff', url: 'https://microsoft.com' };

  // 2. Consistent Category Palette
  const colors = {
    'Income': { bg: '#dcfce7', text: '#166534' },
    'Food': { bg: '#ffedd5', text: '#9a3412' },
    'Shopping': { bg: '#fef9c3', text: '#854d0e' },
    'Transport': { bg: '#dbeafe', text: '#1e40af' },
    'Entertainment': { bg: '#f3e8ff', text: '#6b21a8' },
    'Utilities': { bg: '#fee2e2', text: '#991b1b' },
    'Utility': { bg: '#fee2e2', text: '#991b1b' },
    'Services': { bg: '#e0f2fe', text: '#0369a1' },
    'AI': { bg: '#fae8ff', text: '#86198f' },
    'AI & Tools': { bg: '#fae8ff', text: '#86198f' },
    'Education': { bg: '#fef3c7', text: '#92400e' },
    ...customCategories,
    'Others': { bg: '#f1f5f9', text: '#475569' }
  };
  return colors[category] || colors['Others'];
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const updateCategoryDropdowns = () => {
  const dropdownIds = ['category', 'sub-category'];
  const defaultCategories = ['Food', 'Shopping', 'Transport', 'Entertainment', 'Utilities', 'Services', 'AI', 'Education', 'Others'];
  
  dropdownIds.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    
    // Save current value
    const currentVal = select.value;
    
    // Clear and rebuild
    select.innerHTML = id === 'category' ? '<option value="Income">Income</option>' : '';
    
    const allCats = [...defaultCategories, ...Object.keys(customCategories)];
    const uniqueCats = [...new Set(allCats)];
    
    uniqueCats.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      select.appendChild(option);
    });
    
    // Restore value if still exists
    if ([...select.options].some(o => o.value === currentVal)) {
      select.value = currentVal;
    }
  });
};

window.openCategoryModal = () => {
  const modal = document.getElementById('category-modal');
  if (modal) modal.style.display = 'flex';
};

window.closeCategoryModal = () => {
  const modal = document.getElementById('category-modal');
  if (modal) modal.style.display = 'none';
};

window.addCustomCategory = () => {
  const name = document.getElementById('new-cat-name').value.trim();
  const color = document.getElementById('new-cat-color').value;
  
  if (name) {
    // Generate light bg and dark text for contrast
    customCategories[name] = { 
      bg: color + '22', // Light version
      text: color       // Darker version
    };
    saveData();
    updateCategoryDropdowns();
    closeCategoryModal();
    document.getElementById('new-cat-name').value = '';
    
    // Refresh lists
    if (window.location.pathname.includes('transactions')) initTransactions();
    if (window.location.pathname.includes('subscriptions')) initSubscriptions();
  }
};

// Calculations
const getTotals = () => {
  const tIncome = transactions
    .filter(t => t.category === 'Income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const tExpenses = transactions
    .filter(t => t.category !== 'Income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const sIncome = subscriptions
    .filter(s => s.type === 'Income')
    .reduce((sum, s) => sum + calculateMonthlyCost(s.amount, s.period), 0);
  const sExpenses = subscriptions
    .filter(s => s.type !== 'Income')
    .reduce((sum, s) => sum + calculateMonthlyCost(s.amount, s.period), 0);

  return { income: tIncome, expenses: tExpenses, balance: tIncome - tExpenses, sIncome, sExpenses };
};

const calculateMonthlyCost = (amount, period) => {
  const val = parseFloat(amount || 0);
  if (period === 'Monthly') return val;
  if (period === 'Quarterly') return val / 3;
  if (period === 'Yearly') return val / 12;
  return 0;
};

// UI Toggles
const initDayView = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const dateStr = urlParams.get('date');
  if (!dateStr) {
    window.location.href = 'index.html';
    return;
  }

  const titleEl = document.getElementById('day-title');
  const totalEl = document.getElementById('day-total');
  const incomeEl = document.getElementById('day-income');
  const tList = document.getElementById('day-transactions-list');
  const sList = document.getElementById('day-subscriptions-list');

  titleEl.textContent = formatDate(dateStr);

  const dayTransactions = transactions.filter(t => t.date === dateStr);
  const daySubscriptions = subscriptions.filter(s => {
    if (s.nextDate === dateStr) return true;
    if (s.autoRenew && s.period === 'Monthly') {
      const nextDateObj = new Date(s.nextDate);
      return nextDateObj.getDate() === new Date(dateStr).getDate();
    }
    return false;
  });

  const totalExpense = dayTransactions
    .filter(t => t.category !== 'Income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  
  const totalIncome = dayTransactions
    .filter(t => t.category === 'Income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  totalEl.textContent = formatCurrency(totalExpense);
  incomeEl.textContent = formatCurrency(totalIncome);

  if (dayTransactions.length === 0) {
    tList.innerHTML = `<div class="glass-card" style="padding: 1.5rem; text-align: center; color: var(--slate-400);">No transactions for this day</div>`;
  } else {
    tList.innerHTML = dayTransactions.map(t => {
      const colors = getCategoryColor(t.category, t.description);
      return `
        <div class="glass-card" style="padding: 1rem; display: flex; align-items: center; gap: 1rem; border-left: 4px solid ${colors.text};">
          <div style="flex: 1">
            <p style="font-weight: 700; color: var(--slate-800);">${t.description}</p>
            <p style="font-size: 0.75rem; color: var(--slate-400);">${t.category}</p>
          </div>
          <p style="font-weight: 800; color: ${t.category === 'Income' ? 'var(--emerald-500)' : 'var(--slate-800)'}">${t.category === 'Income' ? '+' : ''}${formatCurrency(t.amount)}</p>
        </div>
      `;
    }).join('');
  }

  if (daySubscriptions.length === 0) {
    sList.innerHTML = `<div class="glass-card" style="padding: 1.5rem; text-align: center; color: var(--slate-400);">No subscriptions due on this day</div>`;
  } else {
    sList.innerHTML = daySubscriptions.map(s => {
      return `
        <div class="glass-card" style="padding: 1rem; display: flex; align-items: center; gap: 1rem;">
          <div style="transform: scale(0.7); width: 44px; display: flex; align-items: center; justify-content: center;">
            ${getServiceLogo(s.name, s.category)}
          </div>
          <div style="flex: 1">
            <p style="font-weight: 700; color: var(--slate-800);">${s.name}</p>
            <p style="font-size: 0.75rem; color: var(--slate-400);">${s.period}</p>
          </div>
          <p style="font-weight: 800; color: var(--slate-800)">${formatCurrency(s.amount)}</p>
        </div>
      `;
    }).join('');
  }
};

window.toggleCalendar = (show) => {
  const overlay = document.getElementById('calendar-overlay');
  if (overlay) {
    if (show) {
      overlay.classList.add('open');
      calendarDate = new Date(); // Reset to today when opening
      renderCalendar();
    }
    else overlay.classList.remove('open');
  }
};

window.setCalendarMonth = (m) => {
  calendarDate.setMonth(parseInt(m));
  renderCalendar();
};

window.setCalendarYear = (y) => {
  calendarDate.setFullYear(parseInt(y));
  renderCalendar();
};

window.changeMonth = (delta) => {
  calendarDate.setMonth(calendarDate.getMonth() + delta);
  renderCalendar();
};

// Calendar Rendering
const renderMiniCalendar = () => {
  const grid = document.getElementById('mini-calendar-grid');
  if (!grid) return;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  grid.innerHTML = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasEvent = transactions.some(t => t.date === dStr) || subscriptions.some(s => {
      if (s.nextDate === dStr) return true;
      if (s.autoRenew && s.period === 'Monthly') {
        return new Date(s.nextDate).getDate() === day;
      }
      return false;
    });
    return `<div class="mini-day ${hasEvent ? 'active' : ''}" 
                 style="${day === today ? 'border: 1px solid var(--primary); background: rgba(var(--primary-rgb), 0.1);' : ''} cursor: pointer;"
                 onclick="window.location.href='day.html?date=${dStr}'"></div>`;
  }).join('');
};

const renderCalendar = () => {
  const container = document.getElementById('expanded-calendar-container');
  if (!container) return;

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; background: var(--slate-50); padding: 0.75rem 1rem; border-radius: 1rem; border: 1px solid var(--slate-100);">
      <button class="btn btn-secondary" style="padding: 0.5rem; border-radius: 0.5rem;" onclick="changeMonth(-1)">
        <svg style="width: 1.1rem; height: 1.1rem" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <select onchange="setCalendarMonth(this.value)" style="background: transparent; border: none; font-weight: 800; font-size: 1.1rem; color: var(--slate-800); cursor: pointer; padding: 0.2rem 0.5rem; width: auto; box-shadow: none;">
          ${months.map((m, i) => `<option value="${i}" ${i === month ? 'selected' : ''}>${m}</option>`).join('')}
        </select>
        <select onchange="setCalendarYear(this.value)" style="background: transparent; border: none; font-weight: 800; font-size: 1.1rem; color: var(--slate-800); cursor: pointer; padding: 0.2rem 0.5rem; width: auto; box-shadow: none;">
          ${Array.from({length: 11}, (_, i) => year - 5 + i).map(y => `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`).join('')}
        </select>
      </div>

      <button class="btn btn-secondary" style="padding: 0.5rem; border-radius: 0.5rem;" onclick="changeMonth(1)">
        <svg style="width: 1.1rem; height: 1.1rem" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </button>
    </div>
    <div class="calendar-grid">
  `;
  
  html += ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="calendar-day-header">${d}</div>`).join('');
  
  for (let i = 0; i < firstDay; i++) {
     const prevMonthDate = new Date(year, month, - (firstDay - i - 1));
     html += `<div class="calendar-day" style="background: var(--slate-50); opacity: 0.4;">
       <div class="calendar-day-num">${prevMonthDate.getDate()}</div>
     </div>`;
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    html += renderDayCell(new Date(year, month, d));
  }
  html += `</div>`;

  container.innerHTML = html;
};

const renderDayCell = (date) => {
  // Format to local YYYY-MM-DD
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const dStr = `${y}-${m}-${d}`;

  const today = new Date();
  const ty = today.getFullYear();
  const tm = String(today.getMonth() + 1).padStart(2, '0');
  const td = String(today.getDate()).padStart(2, '0');
  const isToday = dStr === `${ty}-${tm}-${td}`;
  
  const dayTs = transactions.filter(t => t.date === dStr);
  const daySs = subscriptions.filter(s => {
    if (s.nextDate === dStr) return true;
    if (s.autoRenew && s.period === 'Monthly') {
      const nextDateObj = new Date(s.nextDate);
      // Show on same day number every month
      return nextDateObj.getDate() === date.getDate();
    }
    return false;
  });

  return `
    <div class="calendar-day ${isToday ? 'today' : ''}" style="cursor: pointer;" onclick="window.location.href='day.html?date=${dStr}'">
      <div class="calendar-day-num">${date.getDate()}</div>
      <div class="calendar-events">
        ${daySs.map(s => {
          const colors = getCategoryColor(s.category, s.name);
          return `<div class="event-dot" style="background: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.text}44;" title="${s.name}: ${formatCurrency(s.amount)}">${s.name}</div>`;
        }).join('')}
        ${dayTs.map(t => {
          const colors = getCategoryColor(t.category);
          return `<div class="event-dot" style="background: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.text}44;" title="${t.description}: ${formatCurrency(t.amount)}">${t.description}</div>`;
        }).join('')}
      </div>
    </div>
  `;
};

// Page Initializers
const initDashboard = () => {
  const { income, expenses, balance, sIncome, sExpenses } = getTotals();
  const netMonthlySub = sExpenses - sIncome;

  const elBalance = document.getElementById('total-balance');
  const elIncome = document.getElementById('total-income');
  const elExpenses = document.getElementById('total-expenses');
  const elMonthlySubs = document.getElementById('monthly-subs');
  const elSavingsRate = document.getElementById('savings-rate');
  const elSubCount = document.getElementById('sub-count');

  if (elBalance) elBalance.textContent = formatCurrency(balance - netMonthlySub);
  if (elIncome) elIncome.textContent = formatCurrency(income);
  if (elExpenses) elExpenses.textContent = formatCurrency(expenses);
  if (elMonthlySubs) elMonthlySubs.textContent = formatCurrency(netMonthlySub);

  // Efficiency (Savings Rate)
  if (elSavingsRate) {
    const rate = income > 0 ? Math.round(((income - expenses - netMonthlySub) / income) * 100) : 0;
    elSavingsRate.textContent = `${Math.max(0, rate)}%`;
    elSavingsRate.style.color = rate > 20 ? 'var(--emerald-600)' : (rate > 0 ? 'var(--amber-500)' : 'var(--rose-500)');
    
    // Add dynamic label
    const efficiencyBtn = elSavingsRate.parentElement.querySelector('p:last-child');
    if (efficiencyBtn) {
      if (rate > 50) {
        efficiencyBtn.textContent = "Wealth Machine";
        efficiencyBtn.style.color = "var(--emerald-600)";
      } else if (rate > 20) {
        efficiencyBtn.textContent = "Smart Saver";
        efficiencyBtn.style.color = "var(--emerald-500)";
      } else if (rate > 0) {
        efficiencyBtn.textContent = "Treading Water";
        efficiencyBtn.style.color = "var(--amber-500)";
      } else {
        efficiencyBtn.textContent = "Deficit Mode";
        efficiencyBtn.style.color = "var(--rose-500)";
      }
    }
  }

  // Active Services
  if (elSubCount) {
    elSubCount.textContent = subscriptions.filter(s => s.type !== 'Income').length;
  }

  // Next Payment
  const nextPaymentBox = document.getElementById('next-payment-box');
  if (nextPaymentBox) {
    const now = new Date();
    now.setHours(0,0,0,0);
    
    // Sort by nextDate
    const sortedSubs = [...subscriptions]
      .filter(s => s.type !== 'Income')
      .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));
    
    const futureSubs = sortedSubs.filter(s => new Date(s.nextDate) >= now);
    
    if (futureSubs.length > 0) {
      const nextDate = futureSubs[0].nextDate;
      const sameDaySubs = futureSubs.filter(s => s.nextDate === nextDate);
      
      const subListHtml = sameDaySubs.map(s => `
        <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.75rem;">
          <div style="transform: scale(0.7); width: 44px; display: flex; align-items: center; justify-content: center;">
            ${getServiceLogo(s.name, s.category)}
          </div>
          <div style="flex: 1">
            <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0px; line-height: 1.2;">${s.name}</p>
            <p style="font-size: 0.7rem; color: var(--slate-400); font-weight: 500;">${formatCurrency(s.amount)}</p>
          </div>
        </div>
      `).join('');

      nextPaymentBox.innerHTML = `
        <div style="margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--slate-100);">
           <p style="font-size: 0.7rem; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.025em;">Due ${formatDate(nextDate)}</p>
        </div>
        <div style="max-height: 180px; overflow-y: auto; padding-right: 0.25rem;">
          ${subListHtml}
        </div>
      `;
    } else {
      nextPaymentBox.innerHTML = `
        <div style="text-align: center; padding: 1rem 0; color: var(--slate-400); font-size: 0.8rem;">
          No upcoming payments found
        </div>
      `;
    }
  }

  renderSpendingPulse();
  renderMiniCalendar();
  renderPortfolioTrend();
  updateHealthGauge(income, expenses, netMonthlySub);
};

const updateHealthGauge = (income, expenses, subs) => {
  const fill = document.getElementById('health-fill');
  const marker = document.getElementById('health-marker');
  const label = document.getElementById('health-label');
  if (!fill || !marker || !label) return;

  const totalOut = expenses + subs;
  const ratio = income > 0 ? (totalOut / income) : 1;
  const score = Math.max(0, Math.min(100, (1 - ratio) * 100));
  
  fill.style.width = `${score}%`;
  marker.style.left = `${score}%`;
  
  if (score > 70) {
    label.textContent = "FINANCIAL HEALTH: EXCELLENT";
    label.style.color = "var(--emerald-600)";
  } else if (score > 40) {
    label.textContent = "FINANCIAL HEALTH: STABLE";
    label.style.color = "var(--amber-500)";
  } else {
    label.textContent = "FINANCIAL HEALTH: CRITICAL";
    label.style.color = "var(--rose-500)";
  }
};

const renderPortfolioTrend = () => {
  const container = document.getElementById('portfolio-trend');
  if (!container) return;

  const now = new Date();
  const balanceTrend = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (13 - i));
    const dStr = d.toISOString().split('T')[0];
    
    // Calculate cumulative balance for that day (simplified simulation based on current data)
    let dailyMod = 0;
    transactions.forEach(t => {
      if (t.date === dStr) dailyMod += (t.category === 'Income' ? 1 : -1) * parseFloat(t.amount || 0);
    });
    return dailyMod;
  });

  const min = Math.min(...balanceTrend, -100);
  const max = Math.max(...balanceTrend, 100);
  const range = max - min;
  
  const points = balanceTrend.map((val, i) => {
    const x = (i / (balanceTrend.length - 1)) * 100;
    const y = 40 - ((val - min) / range) * 40;
    return `${x},${y}`;
  }).join(' ');

  container.innerHTML = `
    <svg width="120" height="40" viewBox="0 0 100 40" style="overflow: visible;">
      <defs>
        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="M 0,40 ${points.split(' ').map(p => `L ${p}`).join(' ')} L 100,40 Z" fill="url(#trendGradient)" />
      <polyline points="${points}" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 4px rgba(79, 70, 229, 0.3));" />
    </svg>
  `;
};

const renderSpendingPulse = () => {
  const container = document.getElementById('spending-pulse');
  const velocityEl = document.getElementById('velocity-value');
  if (!container) return;

  const now = new Date();
  const last15Days = Array.from({ length: 15 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (14 - i));
    return d.toISOString().split('T')[0];
  });

  const dailyTotals = {};
  let totalVelocity = 0;
  
  transactions.forEach(t => {
    if (t.category !== 'Income' && last15Days.includes(t.date)) {
      dailyTotals[t.date] = (dailyTotals[t.date] || 0) + parseFloat(t.amount || 0);
      totalVelocity += parseFloat(t.amount || 0);
    }
  });

  const avgVelocity = totalVelocity / 15;
  if (velocityEl) velocityEl.textContent = `${formatCurrency(avgVelocity)}/day`;

  const maxVal = Math.max(...Object.values(dailyTotals), 10); 

  container.innerHTML = last15Days.map((date, idx) => {
    const val = dailyTotals[date] || 0;
    const height = (val / maxVal) * 100;
    const tooltip = `${formatDate(date)}: ${formatCurrency(val)}`;
    
    // Gradient logic: later bars are more vivid
    const opacity = 0.3 + (idx / 14) * 0.7;
    const color = val > avgVelocity * 1.5 ? 'var(--rose-500)' : (val > 0 ? 'var(--primary)' : 'var(--slate-200)');

    return `<div class="pulse-bar" 
                 style="height: ${Math.max(6, height)}%; background: ${color}; --op: ${opacity}; animation-delay: ${idx * 0.05}s;" 
                 data-tooltip="${tooltip}"></div>`;
  }).join('');
};

const initTransactions = () => {
  updateCategoryDropdowns();
  const form = document.getElementById('transaction-form');
  const tableBody = document.getElementById('transaction-list');
  const summaryIncome = document.getElementById('summary-income');
  const summaryExpense = document.getElementById('summary-expense');
  const summaryBalance = document.getElementById('summary-balance');

  const renderTable = () => {
    let sorted = [...transactions];
    
    if (transSortBy === 'date') {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (transSortBy === 'category') {
      sorted.sort((a, b) => a.category.localeCompare(b.category) || new Date(b.date) - new Date(a.date));
    } else if (transSortBy === 'amount') {
      sorted.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    }

    tableBody.innerHTML = sorted.map(t => {
      const colors = getCategoryColor(t.category, t.description);
      return `
      <tr class="animate-fade-in">
        <td style="color: var(--slate-500); font-weight: 500;">${formatDate(t.date)}</td>
        <td>
          <div style="font-weight: 600; color: var(--slate-700);">${t.description}</div>
          ${t.notes ? `<div style="font-size: 0.7rem; color: var(--slate-400); font-weight: 400;">${t.notes}</div>` : ''}
        </td>
        <td>
          <span class="badge" style="background: ${colors.bg}; color: ${colors.text}">
            ${t.category}
          </span>
        </td>
        <td style="text-align: right; font-weight: 700; color: ${t.category === 'Income' ? 'var(--emerald-600)' : 'var(--slate-900)'}">
          ${t.category === 'Income' ? '+' : '-'}${formatCurrency(Math.abs(t.amount))}
        </td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary" style="padding: 0.4rem; border-radius: 0.5rem;" onclick="editTransaction('${t.id}')">
              <svg style="width: 1rem; height: 1rem" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            <button class="btn btn-danger" style="padding: 0.4rem; border-radius: 0.5rem;" onclick="deleteTransaction('${t.id}')">
              <svg style="width: 1rem; height: 1rem" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
    }).join('');

    const { income, expenses, balance } = getTotals();
    if (summaryIncome) summaryIncome.textContent = formatCurrency(income);
    if (summaryExpense) summaryExpense.textContent = formatCurrency(expenses);
    if (summaryBalance) summaryBalance.textContent = formatCurrency(balance);
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    const id = form.dataset.editId || Date.now().toString();
    const data = {
      id,
      description: document.getElementById('desc').value,
      amount: document.getElementById('amount').value,
      category: document.getElementById('category').value,
      date: document.getElementById('date').value,
      notes: document.getElementById('notes').value
    };

    if (form.dataset.editId) {
      transactions = transactions.map(t => t.id === id ? data : t);
      delete form.dataset.editId;
      document.getElementById('submit-btn').textContent = 'Add Transaction';
    } else {
      transactions.push(data);
    }

    saveData();
    form.reset();
    document.getElementById('date').valueAsDate = new Date();
    renderTable();
  };

  window.sortTransactions = (field) => {
    transSortBy = field;
    renderTable();
  };

  window.deleteTransaction = (id) => {
    transactions = transactions.filter(t => t.id !== id);
    saveData();
    renderTable();
  };

  window.editTransaction = (id) => {
    const t = transactions.find(t => t.id === id);
    document.getElementById('desc').value = t.description;
    document.getElementById('amount').value = t.amount;
    document.getElementById('category').value = t.category;
    document.getElementById('date').value = t.date;
    document.getElementById('notes').value = t.notes || '';
    form.dataset.editId = id;
    document.getElementById('submit-btn').textContent = 'Update Transaction';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  renderTable();
};

const initSubscriptions = () => {
  updateCategoryDropdowns();
  const form = document.getElementById('subscription-form');
  const container = document.getElementById('subscription-list');

  const renderList = () => {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    let sorted = [...subscriptions];
    if (subSortBy === 'nextDate') {
      sorted.sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));
    } else if (subSortBy === 'category') {
      sorted.sort((a, b) => a.category.localeCompare(b.category) || new Date(a.nextDate) - new Date(b.nextDate));
    } else if (subSortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (subSortBy === 'amount') {
      sorted.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    }

    container.innerHTML = sorted.map(s => {
      const nextDate = new Date(s.nextDate);
      const isUpcoming = nextDate >= now && nextDate <= sevenDaysLater;
      const monthly = calculateMonthlyCost(s.amount, s.period);
      const subColors = getCategoryColor(s.category, s.name);
      const activeUrl = s.url || subColors.url;

      return `
        <div class="glass-card stat-card sub-card-interactive ${isUpcoming ? 'sub-warning' : 'sub-safe'} animate-fade-in">
          <div style="display: flex; gap: 1rem; align-items: flex-start;">
            <div class="service-logo-container" 
                 onclick="${activeUrl ? `window.open('${activeUrl}', '_blank')` : ''}"
                 style="transition: transform 0.3s ease; ${activeUrl ? 'cursor: pointer;' : ''}">
              ${getServiceLogo(s.name, s.category)}
            </div>
            <div style="flex: 1">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <h3 onclick="${activeUrl ? `window.open('${activeUrl}', '_blank')` : ''}"
                      style="font-size: 1.1rem; font-weight: 700; color: var(--slate-800); ${activeUrl ? 'cursor: pointer; text-decoration: underline decoration-transparent hover:decoration-primary transition-all;' : ''}">${s.name}</h3>
                  <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.25rem;">
                    <span class="badge" 
                          onclick="${activeUrl ? `window.open('${activeUrl}', '_blank')` : ''}"
                          style="background: ${subColors.bg}; color: ${subColors.text}; font-size: 0.65rem; border-radius: 99px; padding: 0.2rem 0.6rem; ${activeUrl ? 'cursor: pointer; position: relative; z-index: 2;' : ''}">
                      ${s.category || 'Services'}
                    </span>
                    <p style="font-size: 0.8rem; color: var(--slate-500); font-weight: 500;">
                      ${s.period} • Billing ${formatDate(s.nextDate)}
                    </p>
                  </div>
                </div>
                <div style="text-align: right">
                  <p style="font-weight: 800; font-size: 1.25rem; color: ${s.type === 'Income' ? 'var(--emerald-600)' : 'var(--slate-900)'};">
                    ${s.type === 'Income' ? '+' : ''}${formatCurrency(s.amount)}
                  </p>
                  <p style="font-size: 0.7rem; color: var(--slate-400); font-weight: 600; text-transform: uppercase;">
                    ${s.type === 'Income' ? 'Recurring' : 'Est.'} ${formatCurrency(monthly)}/mo
                  </p>
                </div>
              </div>
              
              ${s.notes ? `<div style="font-size: 0.8rem; color: var(--slate-600); background: rgba(0,0,0,0.02); padding: 0.75rem; border-radius: 0.75rem; margin-top: 1rem; border: 1px dashed var(--slate-200); position: relative;">${s.notes}</div>` : ''}

              <div style="margin-top: 1.25rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--slate-50); padding-top: 1rem;">
                <span class="badge" style="background: ${s.type === 'Income' ? '#dcfce7' : (s.autoRenew ? 'var(--primary-light)' : 'var(--slate-100)')}; color: ${s.type === 'Income' ? '#166534' : (s.autoRenew ? 'var(--primary)' : 'var(--slate-500)')}; padding: 0.4rem 0.75rem; border-radius: 99px;">
                  ${s.type === 'Income' ? 'Active Income' : (s.autoRenew ? 'Auto-renewing' : 'Manual Renewal')}
                </span>
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn-secondary" style="padding: 0.5rem; border-radius: 0.75rem; background: white; border: 1px solid var(--slate-200);" onclick="editSubscription('${s.id}')">
                    <svg style="width: 1rem; height: 1rem" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button class="btn btn-danger" style="padding: 0.5rem; border-radius: 0.75rem; background: #fff1f2; border: 1px solid #fecdd3;" onclick="deleteSubscription('${s.id}')">
                    <svg style="width: 1rem; height: 1rem" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    const id = form.dataset.editId || Date.now().toString();
    const data = {
      id,
      name: document.getElementById('name').value,
      amount: document.getElementById('amount').value,
      period: document.getElementById('period').value,
      type: document.getElementById('sub-type').value,
      nextDate: document.getElementById('next-date').value,
      category: document.getElementById('sub-category').value,
      url: document.getElementById('sub-url').value,
      autoRenew: document.getElementById('auto-renew').checked,
      notes: document.getElementById('notes').value
    };

    if (form.dataset.editId) {
      subscriptions = subscriptions.map(s => s.id === id ? data : s);
      delete form.dataset.editId;
      document.getElementById('submit-btn').textContent = 'Add Subscription';
    } else {
      subscriptions.push(data);
    }

    saveData();
    form.reset();
    renderList();
  };

  window.sortSubscriptions = (field) => {
    subSortBy = field;
    renderList();
  };

  window.deleteSubscription = (id) => {
    subscriptions = subscriptions.filter(s => s.id !== id);
    saveData();
    renderList();
  };

  window.editSubscription = (id) => {
    const s = subscriptions.find(s => s.id === id);
    document.getElementById('name').value = s.name;
    document.getElementById('amount').value = s.amount;
    document.getElementById('period').value = s.period;
    document.getElementById('sub-type').value = s.type || 'Expense';
    document.getElementById('next-date').value = s.nextDate;
    document.getElementById('sub-category').value = s.category || 'Services';
    document.getElementById('sub-url').value = s.url || '';
    document.getElementById('auto-renew').checked = s.autoRenew;
    document.getElementById('notes').value = s.notes || '';
    form.dataset.editId = id;
    document.getElementById('submit-btn').textContent = 'Update Subscription';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Magic URL logic
  const subUrlInput = document.getElementById('sub-url');
  const nameInput = document.getElementById('name');

  const serviceToUrl = {
    'netflix': 'https://netflix.com',
    'spotify': 'https://spotify.com',
    'chatgpt': 'https://chat.openai.com',
    'claude': 'https://claude.ai',
    'notion': 'https://notion.so',
    'disney+': 'https://disneyplus.com',
    'hulu': 'https://hulu.com',
    'amazon': 'https://amazon.com',
    'prime': 'https://amazon.com',
    'youtube': 'https://youtube.com',
    'apple music': 'https://music.apple.com',
    'adobe': 'https://adobe.com',
    'github': 'https://github.com',
    'figma': 'https://figma.com',
    'slack': 'https://slack.com',
    'canva': 'https://canva.com',
    'xbox': 'https://xbox.com',
    'playstation': 'https://playstation.com',
    'midjourney': 'https://midjourney.com',
    'audible': 'https://audible.com'
  };

  nameInput?.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    if (!subUrlInput.value) {
      for (const [service, url] of Object.entries(serviceToUrl)) {
        if (val.includes(service)) {
          subUrlInput.value = url;
          break;
        }
      }
    }
  });

  renderList();
};

const initReports = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Transaction Category Totals
  const transTotals = {};
  let todayTotal = 0;
  
  transactions.forEach(t => {
    if (t.category === 'Income') return;
    transTotals[t.category] = (transTotals[t.category] || 0) + parseFloat(t.amount || 0);
    if (t.date === todayStr) {
      todayTotal += parseFloat(t.amount || 0);
    }
  });

  const categoryContainer = document.getElementById('category-reports');
  if (categoryContainer) {
    const maxExpense = Math.max(...Object.values(transTotals), 0);
    const categoryBars = Object.entries(transTotals).map(([cat, total]) => {
      const percentage = maxExpense > 0 ? (total / maxExpense) * 100 : 0;
      return `
        <div class="progress-container">
          <div class="progress-label">
            <span>${cat}</span>
            <span>${formatCurrency(total)}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%; background-color: var(--primary)"></div>
          </div>
        </div>
      `;
    }).join('');

    categoryContainer.innerHTML = `
      <div class="glass-card" style="margin-bottom: 2rem; border-left: 4px solid var(--primary);">
        <p class="stat-label">Spent Today</p>
        <h2 style="font-size: 2rem; font-weight: 800; color: var(--slate-900);">${formatCurrency(todayTotal)}</h2>
      </div>
      ${categoryBars || '<div style="text-align: center; padding: 2rem; color: var(--slate-400); font-size: 0.8rem;">No transactions recorded.</div>'}
    `;
  }

  // Subscription Grouping by Category
  const subCategoryContainer = document.getElementById('sub-category-reports');
  if (subCategoryContainer) {
    const groupedSubs = {};
    subscriptions.forEach(s => {
      const cat = s.category || 'Other';
      if (!groupedSubs[cat]) groupedSubs[cat] = [];
      groupedSubs[cat].push(s);
    });

    subCategoryContainer.innerHTML = Object.entries(groupedSubs).length
      ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
          ${Object.entries(groupedSubs).map(([cat, subs]) => {
            const catColors = getCategoryColor(cat);
            return `
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <div style="width: 12px; height: 12px; border-radius: 3px; background: ${catColors.text}"></div>
                  <h4 style="font-size: 0.875rem; font-weight: 700; color: var(--slate-600); text-transform: uppercase; letter-spacing: 0.025em;">${cat}</h4>
                  <span style="font-size: 0.75rem; color: var(--slate-400); font-weight: 600;">(${subs.length})</span>
                </div>
                ${subs.map(s => {
                  const subColors = getCategoryColor(s.category, s.name);
                  return `
                    <div class="glass-card" style="padding: 1rem; display: flex; align-items: center; gap: 1rem; border-left: 4px solid ${subColors.text};">
                      <div style="transform: scale(0.6); width: 30px; display: flex; align-items: center; justify-content: center;">
                        ${getServiceLogo(s.name, s.category)}
                      </div>
                      <div style="flex: 1">
                        <div style="font-weight: 700; color: var(--slate-800); font-size: 0.875rem;">${s.name}</div>
                        <div style="font-size: 0.75rem; color: var(--slate-400);">${formatCurrency(s.amount)} / ${s.period}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `;
          }).join('')}
        </div>
      `
      : '<div style="text-align: center; padding: 2rem; color: var(--slate-400); font-size: 0.8rem;">No subscriptions found.</div>';
  }

  const { sIncome, sExpenses } = getTotals();
  const elReportSubs = document.getElementById('report-monthly-subs');
  if (elReportSubs) elReportSubs.textContent = formatCurrency(sExpenses - sIncome);

  const upcomingList = document.getElementById('upcoming-subs-list');
  if (upcomingList) {
    const now = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);

    const upcoming = subscriptions
      .filter(s => {
        const d = new Date(s.nextDate);
        return d >= now && d <= thirtyDaysLater;
      })
      .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));

    upcomingList.innerHTML = upcoming.length
      ? upcoming.map(s => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border: 1px solid var(--slate-100); border-radius: 0.75rem; background: rgba(255,255,255,0.4);">
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <div style="transform: scale(0.7); transform-origin: left center;">
                ${getServiceLogo(s.name, s.category)}
              </div>
              <div>
                <div style="font-weight: 700; color: var(--slate-800); font-size: 0.875rem;">${s.name}</div>
                <div style="font-size: 0.75rem; color: var(--slate-400); font-weight: 500;">${formatDate(s.nextDate)}</div>
              </div>
            </div>
            <div style="font-weight: 800; color: ${s.type === 'Income' ? 'var(--emerald-600)' : 'var(--slate-900)'};">${s.type === 'Income' ? '+' : ''}${formatCurrency(s.amount)}</div>
          </div>
        `).join('')
      : '<p style="color: var(--slate-400); text-align: center; padding: 1rem;">No payments in the next 30 days.</p>';
  }

  renderWeeklyPulseBlocks();
};

const renderWeeklyPulseBlocks = () => {
  const container = document.getElementById('weekly-pulse-blocks');
  if (!container) return;

  const now = new Date();
  const day = now.getDay();
  // Calculate start of current week (Monday)
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); 
  const startOfWeek = new Date(now.setDate(diff));
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setHours(0,0,0,0);
    d.setDate(startOfWeek.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const dailySpending = {};
  transactions.forEach(t => {
    if (t.category !== 'Income') {
      dailySpending[t.date] = (dailySpending[t.date] || 0) + parseFloat(t.amount || 0);
    }
  });

  const icons = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path></svg>', // Mon
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>', // Tue
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>', // Wed
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path></svg>', // Thu
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>', // Fri
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>', // Sat
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' // Sun
  ];

  container.innerHTML = weekDays.map((date, i) => {
    const val = dailySpending[date] || 0;
    const d = new Date(date);
    const dayLabel = d.toLocaleDateString('default', { weekday: 'short' });
    const isToday = date === new Date().toISOString().split('T')[0];
    
    return `
      <div class="glass-card bento-item" 
           onclick="window.location.href='transactions.html'"
           style="padding: 1.25rem; text-align: center; border-radius: 1.25rem; border: 2px solid ${isToday ? 'var(--primary)' : 'var(--slate-100)'}; cursor: pointer;">
        <div style="width: 40px; height: 40px; margin: 0 auto 0.75rem; background: var(--primary-light); color: var(--primary); padding: 8px; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
          ${icons[i]}
        </div>
        <p style="font-size: 0.65rem; font-weight: 700; color: var(--slate-400); text-transform: uppercase;">${dayLabel}</p>
        <h4 style="font-weight: 800; font-size: 0.9rem; color: var(--slate-800); margin-top: 0.25rem;">${formatCurrency(val)}</h4>
      </div>
    `;
  }).join('');
};

// Global Init
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) initDashboard();
  else if (path.endsWith('transactions.html')) initTransactions();
  else if (path.endsWith('subscriptions.html')) initSubscriptions();
  else if (path.endsWith('reports.html')) initReports();

  // Always render mini calendar if it exists on the page
  renderMiniCalendar();
});
