/**
 * biometric.ts — Real-time biometric attendance feed widget.
 *
 * Designed around the ZKTeco N9 fingerprint device protocol.
 * Drop a <div id="biometric-feed"></div> anywhere and call:
 *
 *   new BiometricRealtimeFeed('biometric-feed', { model, ip, serial, firmware });
 *
 * In production replace `simulateConnection()` with a real WebSocket
 * pointed at your ZKTeco push-notification server or middleware.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type VerifyMethod  = 'Fingerprint' | 'Face' | 'Card' | 'Password';
export type SwipeDirection = 'IN' | 'OUT';
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface BiometricEvent {
  readonly uid:        string;
  readonly employeeId: string;
  readonly name:       string;
  readonly dept:       string;
  readonly timestamp:  Date;
  readonly direction:  SwipeDirection;
  readonly method:     VerifyMethod;
  readonly verified:   boolean;
}

export interface DeviceConfig {
  model:    string;    // e.g. "ZKTeco N9"
  ip:       string;    // e.g. "192.168.1.201"
  serial:   string;    // device serial number
  firmware: string;    // firmware version string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const METHOD_ICON: Record<VerifyMethod, string> = {
  Fingerprint: '☝',
  Face:        '👤',
  Card:        '💳',
  Password:    '🔑',
};

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connecting:   'Connecting…',
  connected:    'Connected',
  disconnected: 'Disconnected',
  error:        'Connection Error',
};

const SAMPLE_EMPLOYEES: ReadonlyArray<{ id: string; name: string; dept: string }> = [
  { id: 'EMP001', name: 'Rahul Sharma',   dept: 'Engineering' },
  { id: 'EMP002', name: 'Priya Gupta',    dept: 'Design'      },
  { id: 'EMP003', name: 'Vikram Singh',   dept: 'Marketing'   },
  { id: 'EMP004', name: 'Anjali Mehta',   dept: 'HR'          },
  { id: 'EMP005', name: 'Suresh Patel',   dept: 'Finance'     },
  { id: 'EMP006', name: 'Deepa Nair',     dept: 'Engineering' },
  { id: 'EMP007', name: 'Arjun Kumar',    dept: 'Sales'       },
  { id: 'EMP008', name: 'Sneha Reddy',    dept: 'Design'      },
  { id: 'EMP009', name: 'Manish Joshi',   dept: 'Operations'  },
  { id: 'EMP010', name: 'Kavya Iyer',     dept: 'Marketing'   },
];

const METHODS: readonly VerifyMethod[] = [
  'Fingerprint', 'Fingerprint', 'Fingerprint', 'Fingerprint',
  'Face', 'Card', 'Password',
];

const MAX_VISIBLE_ROWS = 8;
const MIN_EVENT_INTERVAL_MS = 2500;
const MAX_EVENT_INTERVAL_MS = 8000;

// ─── BiometricRealtimeFeed ───────────────────────────────────────────────────

export class BiometricRealtimeFeed {
  private readonly root:         HTMLElement;
  private eventListEl!:          HTMLElement;
  private statusDotEl!:          HTMLElement;
  private statusTextEl!:         HTMLElement;
  private lastEventEl!:          HTMLElement;
  private checkInCountEl!:       HTMLElement;
  private checkOutCountEl!:      HTMLElement;
  private activeCountEl!:        HTMLElement;

  private status:                ConnectionStatus = 'connecting';
  private checkIns:              number = 0;
  private checkOuts:             number = 0;
  private activeSet:             Set<string> = new Set();
  private secondsSinceLastEvent: number = 0;

  private syncTimerId:   ReturnType<typeof setInterval>  | null = null;
  private eventTimerId:  ReturnType<typeof setTimeout>   | null = null;

  // ── Constructor ────────────────────────────────────────────────────────────

  constructor(containerId: string, device: DeviceConfig) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`BiometricRealtimeFeed: element #${containerId} not found`);
    this.root = el;
    this.buildDOM(device);
    this.resolveRefs();
    this.boot();
  }

  // ── DOM Construction ───────────────────────────────────────────────────────

  private buildDOM(d: DeviceConfig): void {
    this.root.innerHTML = `
      <div class="bio-widget">

        <!-- Header -->
        <div class="bio-header">
          <div class="bio-header-left">
            <span class="bio-status-dot" data-ref="statusDot"></span>
            <span class="bio-title">Biometric Live Feed</span>
            <span class="bio-status-badge" data-ref="statusText">Connecting…</span>
          </div>
          <div class="bio-header-right">
            <span class="bio-device-model">${d.model}</span>
            <span class="bio-device-ip">
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/>
                <path d="M5 1 Q6.5 3 6.5 5 Q6.5 7 5 9 Q3.5 7 3.5 5 Q3.5 3 5 1Z"
                      fill="none" stroke="currentColor" stroke-width="1"/>
                <line x1="1.2" y1="5" x2="8.8" y2="5" stroke="currentColor" stroke-width="1"/>
              </svg>
              ${d.ip}
            </span>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="bio-stats-bar">
          <div class="bio-stat-item">
            <span class="bio-stat-num" data-ref="checkInCount">—</span>
            <span class="bio-stat-lbl">Check-ins</span>
          </div>
          <div class="bio-stat-divider"></div>
          <div class="bio-stat-item">
            <span class="bio-stat-num" data-ref="checkOutCount">—</span>
            <span class="bio-stat-lbl">Check-outs</span>
          </div>
          <div class="bio-stat-divider"></div>
          <div class="bio-stat-item">
            <span class="bio-stat-num" data-ref="activeCount">—</span>
            <span class="bio-stat-lbl">On premises</span>
          </div>
          <div class="bio-stat-divider"></div>
          <div class="bio-stat-item">
            <span class="bio-stat-num" data-ref="lastEvent">—</span>
            <span class="bio-stat-lbl">Last event</span>
          </div>
        </div>

        <!-- Column Headers -->
        <div class="bio-col-headers">
          <span>Time</span>
          <span>Employee</span>
          <span>ID</span>
          <span>Dept</span>
          <span>Method</span>
          <span>Status</span>
        </div>

        <!-- Live Event List -->
        <div class="bio-feed" role="log" aria-live="polite" aria-label="Biometric events">
          <div class="bio-event-list" data-ref="eventList">
            <!-- Placeholder shown before connection -->
            <div class="bio-placeholder">
              <div class="bio-spinner"></div>
              <p>Establishing connection to device…</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bio-widget-footer">
          <span class="bio-fw-info">S/N ${d.serial} &nbsp;·&nbsp; FW ${d.firmware}</span>
          <span class="bio-realtime-pill">
            <span class="bio-pulse"></span>REALTIME
          </span>
        </div>

      </div>`;
  }

  private resolveRefs(): void {
    const ref = <T extends HTMLElement>(name: string): T => {
      const el = this.root.querySelector<T>(`[data-ref="${name}"]`);
      if (!el) throw new Error(`BiometricRealtimeFeed: ref "${name}" missing`);
      return el;
    };
    this.statusDotEl     = ref('statusDot');
    this.statusTextEl    = ref('statusText');
    this.eventListEl     = ref('eventList');
    this.checkInCountEl  = ref('checkInCount');
    this.checkOutCountEl = ref('checkOutCount');
    this.activeCountEl   = ref('activeCount');
    this.lastEventEl     = ref('lastEvent');
  }

  // ── Boot / Connection Simulation ───────────────────────────────────────────

  private boot(): void {
    this.setStatus('connecting');

    // Seed realistic initial stats before first real event fires
    setTimeout(() => {
      this.checkIns  = 12 + Math.floor(Math.random() * 8);
      this.checkOuts = 4  + Math.floor(Math.random() * 4);
      // Pre-populate active set from sample employees
      SAMPLE_EMPLOYEES.slice(0, this.checkIns - this.checkOuts).forEach(e =>
        this.activeSet.add(e.id)
      );
      this.flushStats();

      // Clear placeholder, show connected state
      this.eventListEl.innerHTML = '';
      this.setStatus('connected');

      this.startSyncClock();
      this.scheduleNextEvent();
    }, 1600);
  }

  // ── Status ─────────────────────────────────────────────────────────────────

  private setStatus(s: ConnectionStatus): void {
    this.status = s;
    this.statusDotEl.className  = `bio-status-dot bio-status-${s}`;
    this.statusTextEl.textContent = STATUS_LABEL[s];
  }

  // ── Stats ──────────────────────────────────────────────────────────────────

  private flushStats(): void {
    this.checkInCountEl.textContent  = String(this.checkIns);
    this.checkOutCountEl.textContent = String(this.checkOuts);
    this.activeCountEl.textContent   = String(this.activeSet.size);
  }

  // ── Event Generation ───────────────────────────────────────────────────────

  private scheduleNextEvent(): void {
    const delay = MIN_EVENT_INTERVAL_MS +
                  Math.random() * (MAX_EVENT_INTERVAL_MS - MIN_EVENT_INTERVAL_MS);

    this.eventTimerId = setTimeout(() => {
      if (this.status === 'connected') this.emitEvent();
      this.scheduleNextEvent();
    }, delay);
  }

  private emitEvent(): void {
    const emp = SAMPLE_EMPLOYEES[Math.floor(Math.random() * SAMPLE_EMPLOYEES.length)];

    // Lean toward IN if employee is not currently on premises
    const isActive   = this.activeSet.has(emp.id);
    const direction: SwipeDirection = isActive
      ? (Math.random() > 0.25 ? 'OUT' : 'IN')
      : (Math.random() > 0.15 ? 'IN'  : 'OUT');

    const event: BiometricEvent = {
      uid:        Math.random().toString(36).slice(2, 9),
      employeeId: emp.id,
      name:       emp.name,
      dept:       emp.dept,
      timestamp:  new Date(),
      direction,
      method:     METHODS[Math.floor(Math.random() * METHODS.length)] as VerifyMethod,
      verified:   Math.random() > 0.04,   // ~4% failure rate
    };

    // Update active set
    if (event.verified) {
      if (direction === 'IN')  this.activeSet.add(emp.id);
      else                     this.activeSet.delete(emp.id);
    }

    // Update counters
    if (event.verified) {
      if (direction === 'IN')  this.checkIns++;
      else                     this.checkOuts++;
    }

    this.secondsSinceLastEvent = 0;
    this.lastEventEl.textContent = 'just now';
    this.flushStats();
    this.renderRow(event);
  }

  // ── Row Rendering ──────────────────────────────────────────────────────────

  private renderRow(ev: BiometricEvent): void {
    const row = document.createElement('div');
    row.className = `bio-row bio-row-enter ${ev.verified ? '' : 'bio-row-denied'}`;

    const hh = ev.timestamp.getHours().toString().padStart(2, '0');
    const mm = ev.timestamp.getMinutes().toString().padStart(2, '0');
    const ss = ev.timestamp.getSeconds().toString().padStart(2, '0');

    row.innerHTML = `
      <span class="bio-cell bio-cell-time">${hh}:${mm}:${ss}</span>
      <span class="bio-cell bio-cell-name">${ev.name}</span>
      <span class="bio-cell bio-cell-id">${ev.employeeId}</span>
      <span class="bio-cell bio-cell-dept">${ev.dept}</span>
      <span class="bio-cell bio-cell-method" title="${ev.method}">${METHOD_ICON[ev.method]} <small>${ev.method}</small></span>
      <span class="bio-cell bio-cell-status">
        <span class="bio-dir-badge bio-dir-${ev.direction.toLowerCase()}">${ev.direction}</span>
        <span class="bio-verify-icon">${ev.verified ? '✓' : '✗'}</span>
      </span>`;

    this.eventListEl.prepend(row);

    // Trim excess rows
    while (this.eventListEl.children.length > MAX_VISIBLE_ROWS) {
      this.eventListEl.removeChild(this.eventListEl.lastChild!);
    }

    // Remove entrance animation class after it plays
    requestAnimationFrame(() =>
      setTimeout(() => row.classList.remove('bio-row-enter'), 500)
    );
  }

  // ── Sync Clock ─────────────────────────────────────────────────────────────

  private startSyncClock(): void {
    this.syncTimerId = setInterval(() => {
      this.secondsSinceLastEvent++;
      const s = this.secondsSinceLastEvent;
      if (s < 2)  this.lastEventEl.textContent = 'just now';
      else if (s < 60) this.lastEventEl.textContent = `${s}s ago`;
      else         this.lastEventEl.textContent = `${Math.floor(s / 60)}m ago`;
    }, 1000);
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────

  destroy(): void {
    if (this.syncTimerId  !== null) clearInterval(this.syncTimerId);
    if (this.eventTimerId !== null) clearTimeout(this.eventTimerId);
  }
}
