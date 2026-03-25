// src/App.jsx
import { useState, useEffect, useRef } from "react";
import { storageGet, storageSet } from "./firebase";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; min-height: 100vh; overflow-x: hidden; }

:root {
  --orange:     #e8603a;
  --orange-d:   #c44a26;
  --orange-l:   #fff4ef;
  --orange-b:   #fcd5c2;
  --cream:      #fffaf7;
  --cream2:     #fff4ef;
  --white:      #ffffff;
  --border:     #fde8d8;
  --border2:    #f5cdb0;
  --text:       #1c0f07;
  --text2:      #6b4c3b;
  --text3:      #b08070;
  --green:      #16a34a;
  --green-s:    #f0fdf4;
  --green-b:    #bbf7d0;
  --red:        #dc2626;
  --red-s:      #fef2f2;
  --red-b:      #fecaca;
  --amber:      #d97706;
  --amber-s:    #fffbeb;
  --teal:       #0d9488;
  --teal-s:     #f0fdfa;
  --teal-b:     #99f6e4;
  --purple:     #7c3aed;
  --purple-s:   #f5f3ff;
  --font:       'Inter', -apple-system, sans-serif;
  --serif:      'Instrument Serif', Georgia, serif;
  --r:          10px;
  --r-sm:       7px;
  --r-lg:       16px;
  --sh-xs:      0 1px 2px rgba(28,15,7,.05);
  --sh-sm:      0 1px 4px rgba(28,15,7,.08);
  --sh:         0 4px 12px rgba(28,15,7,.08);
  --sh-lg:      0 12px 32px rgba(28,15,7,.10);
}

body {
  background: var(--cream);
  color: var(--text);
  font-family: var(--font);
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ── SHELL ── */
.app { min-height: 100vh; display: flex; flex-direction: column; background: var(--cream); }
.app-body { flex: 1; width: 100%; }

/* ── NAV ── */
.nav {
  width: 100%;
  position: sticky; top: 0; z-index: 50;
  background: rgba(255,250,247,0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  height: 58px;
  display: flex; align-items: center;
  padding: 0 clamp(20px, 5vw, 60px);
  gap: 12px;
}
.nav-logo {
  font-family: var(--serif); font-style: italic; font-size: 1.3rem;
  color: var(--orange); cursor: pointer; user-select: none;
  display: flex; align-items: center; gap: 6px; flex-shrink: 0;
}
.nav-space { flex: 1; }
.nav-right { display: flex; align-items: center; gap: 8px; }
.nav-pill {
  font-size: 0.76rem; color: var(--text2);
  background: var(--cream2); border: 1px solid var(--border);
  padding: 4px 10px; border-radius: 100px;
  max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* ── FOOTER ── */
.footer {
  width: 100%;
  border-top: 1px solid var(--border);
  padding: 18px clamp(20px, 5vw, 60px);
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 8px;
  background: var(--white);
}
.footer-l { display: flex; align-items: center; gap: 10px; }
.footer-logo { font-family: var(--serif); font-style: italic; font-size: 1rem; color: var(--orange); }
.footer-dot { color: var(--border2); }
.footer-by { font-size: 0.74rem; color: var(--text3); }
.footer-by strong { color: var(--text2); font-weight: 600; }
.footer-r { font-size: 0.71rem; color: var(--text3); }

/* ── PAGE WRAPPERS ── */
.page {
  width: 100%;
  min-height: calc(100vh - 58px - 58px);
  display: flex; align-items: center; justify-content: center;
  padding: clamp(28px, 5vw, 60px) clamp(20px, 5vw, 60px);
}
.page-top {
  width: 100%;
  min-height: calc(100vh - 58px - 58px);
  padding: clamp(28px, 4vw, 52px) clamp(20px, 5vw, 60px);
}
.narrow { width: 100%; max-width: 440px; }
.mid    { width: 100%; max-width: 560px; }
.full   { width: 100%; }

/* ── HERO ── */
.hero-wrap {
  width: 100%;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: clamp(48px, 8vw, 100px) 0 clamp(40px, 6vw, 72px);
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--orange-l); border: 1px solid var(--orange-b);
  color: var(--orange); font-size: 0.71rem; font-weight: 600;
  letter-spacing: 0.05em; padding: 4px 14px; border-radius: 100px;
  margin-bottom: 24px; text-transform: uppercase;
}
.hero-title {
  font-family: var(--serif);
  font-size: clamp(2.6rem, 6vw, 4.4rem);
  font-weight: 400; line-height: 1.1; letter-spacing: -0.02em;
  color: var(--text); margin-bottom: 20px; max-width: 800px;
}
.hero-title em { font-style: italic; color: var(--orange); }
.hero-sub {
  font-size: clamp(0.9rem, 2vw, 1.05rem); color: var(--text2);
  line-height: 1.8; max-width: 520px; margin-bottom: 36px; font-weight: 300;
}
.hero-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 48px; }
.hero-by {
  font-size: 0.75rem; color: var(--text3);
  display: flex; align-items: center; gap: 6px; margin-bottom: 60px;
}
.hero-by strong { color: var(--text2); font-weight: 500; }

/* Feature grid — full width, no max */
.feat-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--border);
  gap: 1px;
}
.feat-item {
  background: var(--white);
  padding: 22px 20px;
  transition: background 0.15s;
}
.feat-item:hover { background: var(--orange-l); }
.feat-i { font-size: 1.1rem; margin-bottom: 8px; display: block; }
.feat-t { font-size: 0.82rem; font-weight: 600; color: var(--text); margin-bottom: 3px; }
.feat-d { font-size: 0.74rem; color: var(--text2); line-height: 1.5; }

/* ── CARD ── */
.card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--r-lg); padding: clamp(22px, 4vw, 38px);
  box-shadow: var(--sh-sm); width: 100%;
}
.card-t { font-family: var(--serif); font-style: italic; font-size: 1.55rem; font-weight: 400; color: var(--text); margin-bottom: 4px; }
.card-s { font-size: 0.86rem; color: var(--text2); line-height: 1.65; margin-bottom: 24px; font-weight: 300; }

/* ── FORM ── */
.field { margin-bottom: 14px; }
.field label { display: block; font-size: 0.75rem; font-weight: 500; color: var(--text2); margin-bottom: 5px; }
.field input, .field textarea, .field select {
  width: 100%; background: var(--cream);
  border: 1px solid var(--border2); border-radius: var(--r);
  padding: 10px 13px; color: var(--text); font-family: var(--font); font-size: 0.9rem;
  outline: none; transition: border-color 0.15s, box-shadow 0.15s; resize: vertical;
  -webkit-appearance: none;
}
.field input:focus, .field textarea:focus, .field select:focus {
  border-color: var(--orange); box-shadow: 0 0 0 3px rgba(232,96,58,0.1);
}
.field input::placeholder, .field textarea::placeholder { color: var(--text3); }
.field-hint { font-size: 0.71rem; color: var(--text3); margin-top: 4px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* Toggle */
.tog-row {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  padding: 13px 15px; background: var(--cream); border: 1px solid var(--border);
  border-radius: var(--r); margin-bottom: 14px;
}
.tog-label { font-size: 0.84rem; font-weight: 500; color: var(--text); margin-bottom: 2px; }
.tog-desc  { font-size: 0.73rem; color: var(--text3); line-height: 1.5; }
.tog { position: relative; width: 38px; height: 22px; flex-shrink: 0; margin-top: 2px; }
.tog input { opacity: 0; width: 0; height: 0; }
.tog-track { position: absolute; inset: 0; background: var(--border2); border-radius: 100px; cursor: pointer; transition: 0.2s; }
.tog-track::before { content:''; position:absolute; width:16px; height:16px; left:3px; top:3px; background:white; border-radius:50%; transition:0.2s; box-shadow:var(--sh-xs); }
.tog input:checked + .tog-track { background: var(--orange); }
.tog input:checked + .tog-track::before { transform: translateX(16px); }

/* ── BUTTONS ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  font-family: var(--font); font-weight: 500; font-size: 0.875rem;
  border: none; border-radius: 100px; cursor: pointer; transition: all 0.15s;
  touch-action: manipulation; white-space: nowrap;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-primary { background: var(--orange); color: white; padding: 10px 20px; box-shadow: 0 2px 8px rgba(232,96,58,0.25); }
.btn-primary:hover:not(:disabled) { background: var(--orange-d); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(232,96,58,0.3); }

.btn-secondary { background: var(--white); color: var(--text); padding: 10px 20px; border: 1px solid var(--border2); }
.btn-secondary:hover:not(:disabled) { background: var(--cream2); border-color: var(--orange-b); }

.btn-ghost { background: transparent; color: var(--text2); padding: 8px 14px; border: 1px solid transparent; }
.btn-ghost:hover:not(:disabled) { background: var(--cream2); color: var(--text); }

.btn-teal { background: var(--teal); color: white; padding: 10px 20px; box-shadow: 0 2px 8px rgba(13,148,136,0.2); }
.btn-teal:hover:not(:disabled) { background: #0f766e; transform: translateY(-1px); }

.btn-sm  { padding: 6px 13px; font-size: 0.79rem; }
.btn-full{ width: 100%; padding: 11px 20px; font-size: 0.9rem; }
.btn-lg  { padding: 11px 26px; font-size: 0.93rem; }
.btn-row { display: flex; gap: 8px; }
.btn-row .btn { flex: 1; }

/* ── TABS ── */
.tab-row { display: flex; background: var(--cream); border-radius: var(--r); padding: 3px; margin-bottom: 22px; border: 1px solid var(--border); }
.tab-btn { flex: 1; padding: 7px; border: none; background: transparent; cursor: pointer; font-family: var(--font); font-size: 0.83rem; font-weight: 500; color: var(--text3); border-radius: var(--r-sm); transition: all 0.15s; }
.tab-btn.on { background: var(--white); color: var(--text); box-shadow: var(--sh-xs); }

/* ── ALERTS ── */
.alert { font-size: 0.82rem; padding: 10px 13px; border-radius: var(--r); margin-bottom: 14px; line-height: 1.55; display: flex; gap: 8px; align-items: flex-start; }
.a-err    { background: var(--red-s);    border: 1px solid var(--red-b);    color: var(--red);    }
.a-info   { background: var(--orange-l); border: 1px solid var(--orange-b); color: var(--orange-d); }
.a-ok     { background: var(--green-s);  border: 1px solid var(--green-b);  color: var(--green);  }
.a-teal   { background: var(--teal-s);   border: 1px solid var(--teal-b);   color: var(--teal);   }
.a-amber  { background: var(--amber-s);  border: 1px solid #fde68a;          color: var(--amber);  }
.a-purple { background: var(--purple-s); border: 1px solid #ddd6fe;          color: var(--purple); }

/* ── CODE / TOKEN BOX ── */
.code-box { background: var(--text); color: white; border-radius: var(--r); padding: 18px 20px; text-align: center; margin: 14px 0; }
.code-lbl { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text3); margin-bottom: 6px; }
.code-val { font-family: monospace; font-size: clamp(1.7rem,5vw,2.1rem); font-weight: 700; letter-spacing: 0.12em; color: white; }
.code-note{ font-size: 0.71rem; color: var(--text3); margin-top: 5px; }

.token-box { background: var(--teal-s); border: 1px solid var(--teal-b); border-radius: var(--r); padding: 16px 20px; text-align: center; margin: 14px 0; }
.token-lbl { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--teal); margin-bottom: 5px; }
.token-val { font-family: monospace; font-size: 1.4rem; font-weight: 700; letter-spacing: 0.14em; color: var(--teal); }
.token-note{ font-size: 0.72rem; color: var(--text2); margin-top: 6px; line-height: 1.5; }

/* ── MOOD ── */
.mood-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.mood-btn {
  padding: 9px 11px; border: 1px solid var(--border2); border-radius: var(--r-sm);
  background: var(--cream); cursor: pointer; font-family: var(--font); font-size: 0.8rem;
  font-weight: 500; color: var(--text2); transition: all 0.15s;
  display: flex; align-items: center; gap: 7px;
}
.mood-btn:hover { border-color: var(--orange-b); background: var(--orange-l); }
.mood-btn.on { border-color: var(--orange); background: var(--orange-l); color: var(--orange-d); }

/* ── NUDGE ── */
.nudge { background: var(--cream); border-left: 3px solid var(--orange-b); padding: 12px 14px; border-radius: 0 var(--r-sm) var(--r-sm) 0; margin-bottom: 16px; }
.nudge-t { font-size: 0.78rem; font-weight: 600; color: var(--text); margin-bottom: 3px; }
.nudge-p { font-size: 0.77rem; color: var(--text2); line-height: 1.6; }

/* ── FLAGGED ── */
.flagged { background: var(--amber-s); border: 1px solid #fde68a; border-radius: var(--r); padding: 14px 16px; margin-bottom: 14px; }
.flagged-i { font-size: 1.5rem; display: block; margin-bottom: 6px; animation: shake 0.4s ease; }
@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
.flagged-t { font-size: 0.875rem; font-weight: 600; color: var(--amber); margin-bottom: 4px; }
.flagged-p { font-size: 0.78rem; color: var(--text2); line-height: 1.55; }

/* ── CHECKING ── */
.checking { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--cream); border: 1px solid var(--border); border-radius: var(--r-sm); margin-bottom: 12px; }
.spinner { width: 15px; height: 15px; border: 2px solid var(--border2); border-top-color: var(--orange); border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── BANNERS ── */
.banner { display: flex; align-items: flex-start; gap: 10px; padding: 11px 14px; border-radius: var(--r); margin-bottom: 14px; font-size: 0.82rem; line-height: 1.55; }
.bn-red    { background: var(--red-s);    border: 1px solid var(--red-b);    color: var(--red);    }
.bn-amber  { background: var(--amber-s);  border: 1px solid #fde68a;          color: var(--amber);  }
.bn-teal   { background: var(--teal-s);   border: 1px solid var(--teal-b);    color: var(--teal);   }
.bn-warm   { background: var(--orange-l); border: 1px solid var(--orange-b);  color: var(--orange-d); }
.banner strong { font-weight: 600; display: block; margin-bottom: 2px; }

/* ── SHARE BAR ── */
.share-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 16px; background: var(--cream); border: 1px solid var(--border);
  border-radius: var(--r); margin-bottom: 18px;
}
.share-code { font-family: monospace; font-size: 1rem; font-weight: 700; color: var(--orange); letter-spacing: 0.08em; flex: 1; }
.share-lbl  { font-size: 0.71rem; color: var(--text3); white-space: nowrap; }

/* ── STATS ── */
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(95px,1fr)); gap: 10px; margin-bottom: 18px; }
.stat-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--r); padding: 14px 16px; }
.stat-val  { font-size: 1.65rem; font-weight: 700; color: var(--orange); line-height: 1; font-variant-numeric: tabular-nums; }
.stat-val.danger { color: var(--red); }
.stat-lbl  { font-size: 0.69rem; font-weight: 500; color: var(--text3); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 3px; }

/* ── STATUS ── */
.status { display: inline-flex; align-items: center; gap: 5px; font-size: 0.72rem; font-weight: 500; padding: 2px 8px; border-radius: 100px; }
.st-live   { background: var(--green-s);  color: var(--green); }
.st-closed { background: var(--red-s);    color: var(--red);   }
.st-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.st-live .st-dot { animation: blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

/* ── TOOLBAR ── */
.toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 10px; }
.toolbar-t { font-size: 0.875rem; font-weight: 600; color: var(--text); }
.toolbar-r { display: flex; gap: 6px; flex-wrap: wrap; }

/* ── SESSION ITEMS ── */
.s-item {
  background: var(--white); border: 1px solid var(--border); border-radius: var(--r);
  padding: clamp(13px,3vw,18px) clamp(15px,3vw,20px);
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  flex-wrap: wrap; margin-bottom: 8px; transition: border-color 0.15s;
}
.s-item:hover { border-color: var(--border2); }
.s-name { font-size: 0.93rem; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.s-meta { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; font-size: 0.73rem; color: var(--text3); }

/* ── FEEDBACK CARDS ── */
.fb-list { display: flex; flex-direction: column; gap: 10px; }
.fb-card {
  background: var(--white); border: 1px solid var(--border); border-radius: var(--r);
  padding: clamp(14px,3vw,20px); transition: border-color 0.15s, box-shadow 0.15s;
  animation: fadeUp 0.25s ease;
}
@keyframes fadeUp { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
.fb-card:hover { border-color: var(--border2); box-shadow: var(--sh-sm); }
.fb-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
.v-badge { font-size: 0.7rem; font-weight: 600; color: var(--orange); background: var(--orange-l); border: 1px solid var(--orange-b); padding: 2px 8px; border-radius: 100px; }
.m-badge { font-size: 0.7rem; font-weight: 500; padding: 2px 8px; border-radius: 100px; display: inline-flex; align-items: center; gap: 4px; }
.mb-encourage { background: #f0fdf4; color: #15803d; }
.mb-suggest   { background: var(--orange-l); color: var(--orange-d); }
.mb-appreciate{ background: #fdf4ff; color: #9333ea; }
.mb-critique  { background: var(--amber-s); color: var(--amber); }
.mb-general   { background: var(--cream2); color: var(--text3); }
.fb-text { font-size: 0.9rem; line-height: 1.75; color: var(--text); white-space: pre-wrap; margin-bottom: 12px; word-break: break-word; font-weight: 300; }
.fb-foot { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; border-top: 1px solid var(--cream2); padding-top: 10px; }
.fb-time { font-size: 0.69rem; color: var(--text3); }
.fb-acts { display: flex; align-items: center; gap: 6px; }
.chip { font-size: 0.66rem; font-weight: 500; padding: 2px 8px; border-radius: 100px; border: 1px solid var(--border); color: var(--text3); background: var(--white); }
.chip-teal { border-color: var(--teal-b); color: var(--teal); background: var(--teal-s); cursor: pointer; transition: all 0.15s; }
.chip-teal:hover { background: var(--teal); color: white; }

/* ── CHAT ── */
.chat-head { padding-bottom: 14px; border-bottom: 1px solid var(--border); margin-bottom: 14px; }
.chat-msgs { height: 380px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding: 2px; }
.chat-empty { display: flex; align-items: center; justify-content: center; height: 100%; font-size: 0.83rem; color: var(--text3); text-align: center; }
.bubble { max-width: 74%; }
.bubble.mine    { align-self: flex-end; }
.bubble.theirs  { align-self: flex-start; }
.bubble-text { padding: 9px 13px; border-radius: 13px; font-size: 0.875rem; line-height: 1.6; word-break: break-word; }
.mine   .bubble-text { background: var(--orange); color: white; border-bottom-right-radius: 3px; }
.theirs .bubble-text { background: var(--cream2); color: var(--text); border-bottom-left-radius: 3px; }
.bubble-time { font-size: 0.61rem; color: var(--text3); margin-top: 3px; padding: 0 2px; }
.mine .bubble-time { text-align: right; }
.chat-input-row { display: flex; gap: 8px; margin-top: 11px; }
.chat-ta { flex: 1; background: var(--cream); border: 1px solid var(--border2); border-radius: var(--r-sm); padding: 9px 12px; font-family: var(--font); font-size: 0.875rem; color: var(--text); outline: none; resize: none; transition: border-color 0.15s; }
.chat-ta:focus { border-color: var(--orange); }

/* ── EMPTY STATE ── */
.empty { text-align: center; padding: clamp(40px,7vw,64px) 24px; }
.empty-i { font-size: 2.2rem; margin-bottom: 12px; display: block; }
.empty-t { font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 6px; }
.empty-p { font-size: 0.83rem; color: var(--text2); line-height: 1.65; }

/* ── POP ── */
.pop { animation: popIn 0.35s cubic-bezier(0.175,0.885,0.32,1.275); }
@keyframes popIn { from{transform:scale(0.8);opacity:0} to{transform:scale(1);opacity:1} }

/* ── RESPONSIVE ── */
@media (max-width: 1100px) {
  .feat-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 700px) {
  .feat-grid { grid-template-columns: repeat(2, 1fr); }
  .field-row  { grid-template-columns: 1fr; }
  .btn-row    { flex-direction: column; }
  .btn-row .btn { width: 100%; }
  .mood-grid  { grid-template-columns: 1fr; }
  .stat-grid  { grid-template-columns: 1fr 1fr; }
  .footer     { flex-direction: column; align-items: flex-start; }
  .hero-btns  { flex-direction: column; align-items: stretch; }
  .toolbar    { flex-direction: column; align-items: stretch; }
}
@media (max-width: 480px) {
  .feat-grid { grid-template-columns: 1fr; }
}
@media print {
  .nav, .btn, .toolbar-r, .share-bar, .footer { display: none !important; }
  .fb-card { break-inside: avoid; box-shadow: none !important; }
}
`;

/* ─── HELPERS ─── */
const SESSION_TTL = 10 * 60 * 1000;
const DURATIONS = [
  { label: "24 Hours", v: 86400000 },
  { label: "48 Hours", v: 172800000 },
  { label: "7 Days",   v: 604800000 },
  { label: "No Limit", v: null },
];
const MOODS = [
  { key:"encourage",  icon:"💪", label:"Encouraging",     cls:"mb-encourage" },
  { key:"suggest",    icon:"🔧", label:"Suggestion",      cls:"mb-suggest"   },
  { key:"appreciate", icon:"❤️", label:"Appreciation",    cls:"mb-appreciate"},
  { key:"critique",   icon:"⚠️", label:"Honest Critique", cls:"mb-critique"  },
];

function hash(s){ let h=0; for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;} return h.toString(36); }
function uid6(){ return Math.random().toString(36).slice(2,8).toUpperCase(); }
function uid(){ return Math.random().toString(36).slice(2); }
function mktoken(){ return "V"+uid6(); }
function timeAgo(ts){ const d=Date.now()-ts,m=Math.floor(d/60000),h=Math.floor(m/60),dy=Math.floor(h/24); if(dy>0)return new Date(ts).toLocaleDateString(undefined,{month:"short",day:"numeric"}); if(h>0)return`${h}h ago`; if(m>0)return`${m}m ago`; return"just now"; }
function fmtDate(ts){ return new Date(ts).toLocaleString(undefined,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}); }
function ttl(e){ if(!e)return null; const d=e-Date.now(); if(d<=0)return"Expired"; const h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000); return h>24?`${Math.floor(h/24)}d ${h%24}h`:`${h}h ${m}m`; }
function isExp(s){ return s.expiresAt&&Date.now()>s.expiresAt; }
async function checkTox(msg){ try{ const r=await fetch("/api/moderate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:msg})}); const d=await r.json(); return d.toxic===true; }catch{ return false; } }

function Footer(){
  return(
    <footer className="footer">
      <div className="footer-l">
        <span className="footer-logo">Whispr 🤫</span>
        <span className="footer-dot">·</span>
        
      </div>
      <div className="footer-r">Share what you truly feel — anonymously</div>
    </footer>
  );
}

export default function App(){
  const[screen,go]       = useState("home");
  const[user,setUser]    = useState(null);
  const[session,setSess] = useState(null);
  const[feeds,setFeeds]  = useState([]);
  const[copied,setCopied]= useState(false);
  const[chatVoice,setChatVoice]=useState(null);

  useEffect(()=>{
    const el=document.createElement("style"); el.textContent=STYLES; document.head.appendChild(el);
    return()=>document.head.removeChild(el);
  },[]);

  useEffect(()=>{
    try{
      const raw=localStorage.getItem("wa"); if(!raw)return;
      const{u,t}=JSON.parse(raw);
      if(Date.now()-t<SESSION_TTL){ setUser(u); go("dash-home"); }
      else localStorage.removeItem("wa");
    }catch{}
  },[]);

  useEffect(()=>{
    if(!user)return;
    const r=()=>{ const raw=localStorage.getItem("wa"); if(raw){ const p=JSON.parse(raw); localStorage.setItem("wa",JSON.stringify({...p,t:Date.now()})); }};
    window.addEventListener("click",r); window.addEventListener("keydown",r);
    return()=>{ window.removeEventListener("click",r); window.removeEventListener("keydown",r); };
  },[user]);

  const login=(u)=>{ setUser(u); localStorage.setItem("wa",JSON.stringify({u,t:Date.now()})); go("dash-home"); };
  const logout=()=>{ setUser(null); setSess(null); localStorage.removeItem("wa"); go("home"); };
  const nav=(s)=>{ go(s); window.scrollTo(0,0); };
  const copyCode=(c)=>{ navigator.clipboard.writeText(c).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); }); };
  const loadFeeds=async(sid)=>{ const f=await storageGet(`feeds:${sid}`)||[]; setFeeds(f); return f; };

  const exportPDF=()=>{
    const w=window.open("","_blank"); const tc=session.tc||0;
    const rows=[...feeds].reverse().map(f=>{ const m=MOODS.find(x=>x.key===f.mood);
      return`<div style="border:1px solid #fde8d8;border-radius:8px;padding:14px 18px;margin-bottom:10px;page-break-inside:avoid;">
        <div style="font-size:11px;color:#b08070;margin-bottom:6px;">Voice #${f.vn} · ${m?m.icon+" "+m.label:"General"} · ${fmtDate(f.ts)}</div>
        <div style="font-size:14px;line-height:1.7;color:#1c0f07;white-space:pre-wrap;">${f.msg.replace(/</g,"&lt;")}</div></div>`;
    }).join("");
    w.document.write(`<html><head><title>Whispr — ${session.name}</title>
      <style>body{font-family:-apple-system,sans-serif;background:#fffaf7;padding:36px;max-width:700px;margin:auto;color:#1c0f07;}
      h1{font-size:1.3rem;font-weight:700;margin-bottom:4px;color:#e8603a;}.meta{font-size:12px;color:#b08070;margin-bottom:20px;}
      .warn{background:#fef2f2;border:1px solid #fecaca;padding:10px 14px;border-radius:6px;color:#dc2626;font-size:12px;margin-bottom:16px;}
      .cr{margin-top:24px;padding-top:12px;border-top:1px solid #fde8d8;font-size:11px;color:#b08070;}</style></head>
      <body><h1>Whispr — ${session.name}</h1>
      <div class="meta">Session ${session.id} · ${feeds.length} voices · Exported ${new Date().toLocaleDateString()}</div>
      ${tc>0?`<div class="warn">⚠️ ${tc} message${tc>1?"s were":" was"} blocked by AI and permanently deleted.</div>`:""}
      ${rows}<div class="cr">Built by Ankamma Rao G (ak) · Whispr Anonymous Platform</div>
      <script>window.print();<\/script></body></html>`);
    w.document.close();
  };

  return(
    <div className="app">
      <div className="app-body">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo" onClick={()=>nav(user?"dash-home":"home")}>Whispr 🤫</div>
          <div className="nav-space"/>
          <div className="nav-right">
            {user?(
              <>
                <span className="nav-pill">👤 {user.name}</span>
                {screen==="session"&&session&&<button className="btn btn-ghost btn-sm" onClick={()=>{setSess(null);nav("dash-home");}}>← My Spaces</button>}
                {screen==="chat-c"&&<button className="btn btn-ghost btn-sm" onClick={()=>nav("session")}>← Dashboard</button>}
                <button className="btn btn-ghost btn-sm" onClick={logout}>Sign out</button>
              </>
            ):(
              <>
                {screen!=="home"&&<button className="btn btn-ghost btn-sm" onClick={()=>nav("home")}>← Home</button>}
                <button className="btn btn-secondary btn-sm" onClick={()=>nav("login")}>Log in</button>
              </>
            )}
          </div>
        </nav>

        {/* SCREENS */}
        {screen==="home"      && <HomeScreen nav={nav}/>}
        {screen==="login"     && <LoginScreen onLogin={login}/>}
        {screen==="dash-home" && user && <DashHome user={user} nav={nav} setSess={setSess} loadFeeds={loadFeeds}/>}
        {screen==="create"    && user && <CreateSpace user={user} onDone={(s)=>{setSess(s);nav("ready");}}/>}
        {screen==="ready"     && session && <SpaceReady session={session} nav={nav} copyCode={copyCode} copied={copied}/>}
        {screen==="session"   && session && <SessionDash session={session} feeds={feeds} reload={()=>loadFeeds(session.id)} copyCode={copyCode} copied={copied} onExport={exportPDF} onChat={(vn)=>{setChatVoice(vn);nav("chat-c");}}/>}
        {screen==="chat-c"    && session && chatVoice!=null && <CreatorChat session={session} vn={chatVoice}/>}
        {screen==="join"      && <JoinSpace onJoined={(s)=>{setSess(s);nav("submit");}}/>}
        {screen==="submit"    && session && <SubmitScreen session={session} onDone={()=>nav("done")}/>}
        {screen==="done"      && <DoneScreen nav={nav}/>}
        {screen==="chat-v"    && <VoiceChat nav={nav}/>}
      </div>
      <Footer/>
    </div>
  );
}

/* ─── HOME ─── */
function HomeScreen({nav}){
  return(
    <div style={{width:"100%",padding:`0 clamp(20px,5vw,60px)`}}>
      <div className="hero-wrap">
        <div className="hero-badge">🤫 Anonymous feedback platform</div>
        <h1 className="hero-title">Hear what people <em>really</em><br/>feel about you</h1>
        <p className="hero-sub">Create a private space for your team, college group, or friends. Collect raw, honest feelings — AI keeps it respectful, zero identity ever revealed.</p>
        <div className="hero-btns">
          <button className="btn btn-primary btn-lg" onClick={()=>nav("login")}>Get started →</button>
          <button className="btn btn-secondary btn-lg" onClick={()=>nav("join")}>Join a space</button>
          <button className="btn btn-ghost btn-lg" onClick={()=>nav("chat-v")}>Access my discussion</button>
        </div>
        <div className="hero-by">An idea & product by <strong>ak</strong></div>
        <div className="feat-grid">
          {[
            ["🔐","Creator accounts","Sign up once, manage all your spaces from one dashboard."],
            ["🗣️","Anonymous voices","Each person is Voice #1, #2, #3 — nothing more ever stored."],
            ["🤖","AI moderation","Blocks abuse. Raw honest feelings always get through."],
            ["💬","Private discussion","Creator & Voice chat anonymously — no identity ever revealed."],
            ["⏱️","Timed sessions","Auto-close after 24h or 7 days. Feelings saved permanently."],
            ["📄","PDF export","Download all voices as a clean, formatted report."],
          ].map(([i,t,d])=>(
            <div className="feat-item" key={t}>
              <span className="feat-i">{i}</span>
              <div className="feat-t">{t}</div>
              <div className="feat-d">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── LOGIN ─── */
function LoginScreen({onLogin}){
  const[tab,setTab]=useState("login");
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[pass,setPass]=useState("");
  const[err,setErr]=useState("");
  const[busy,setBusy]=useState(false);
  const handle=async()=>{
    setErr(""); setBusy(true);
    if(tab==="signup"){
      if(!name.trim()){setErr("Enter your name.");setBusy(false);return;}
      if(!email.includes("@")){setErr("Enter a valid email.");setBusy(false);return;}
      if(pass.length<6){setErr("Password must be 6+ characters.");setBusy(false);return;}
      const ex=await storageGet(`user:${email.toLowerCase()}`);
      if(ex){setErr("Email already registered. Log in instead.");setBusy(false);return;}
      const u={email:email.toLowerCase(),name:name.trim(),ph:hash(pass)};
      await storageSet(`user:${email.toLowerCase()}`,u); onLogin({email:u.email,name:u.name});
    }else{
      if(!email.trim()||!pass.trim()){setErr("Fill in all fields.");setBusy(false);return;}
      const u=await storageGet(`user:${email.toLowerCase()}`);
      if(!u||u.ph!==hash(pass)){setErr("Incorrect email or password.");setBusy(false);return;}
      onLogin({email:u.email,name:u.name});
    }
    setBusy(false);
  };
  return(
    <div className="page"><div className="narrow">
      <div className="card">
        <div className="tab-row">
          <button className={`tab-btn ${tab==="login"?"on":""}`} onClick={()=>{setTab("login");setErr("");}}>Log in</button>
          <button className={`tab-btn ${tab==="signup"?"on":""}`} onClick={()=>{setTab("signup");setErr("");}}>Sign up</button>
        </div>
        <div className="card-t">{tab==="login"?"Welcome back":"Create account"}</div>
        <div className="card-s">{tab==="login"?"Log in to manage your feedback spaces.":"Sign up free — takes under a minute."}</div>
        {err&&<div className="alert a-err">⚠️ {err}</div>}
        {tab==="signup"&&<div className="field"><label>Full name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></div>}
        <div className="field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div>
        <div className="field"><label>Password</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder={tab==="signup"?"Min 6 characters":"Your password"} onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
        <button className="btn btn-primary btn-full" onClick={handle} disabled={busy}>{busy?"Please wait…":tab==="login"?"Log in →":"Create account →"}</button>
      </div>
    </div></div>
  );
}

/* ─── DASH HOME ─── */
function DashHome({user,nav,setSess,loadFeeds}){
  const[spaces,setSpaces]=useState([]);
  const[busy,setBusy]=useState(true);
  useEffect(()=>{
    (async()=>{ const ids=await storageGet(`spaces:${user.email}`)||[]; const list=(await Promise.all(ids.map(id=>storageGet(`session:${id}`)))).filter(Boolean).reverse(); setSpaces(list); setBusy(false); })();
  },[]);
  const open=async(s)=>{ setSess(s); await loadFeeds(s.id); nav("session"); };
  return(
    <div className="page-top"><div className="full">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:26,gap:16,flexWrap:"wrap"}}>
        <div>
          <h1 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontSize:"clamp(1.4rem,3vw,1.8rem)",fontWeight:400,marginBottom:4}}>Your Spaces</h1>
          <p style={{fontSize:".84rem",color:"var(--text3)"}}>Good to see you, {user.name}.</p>
        </div>
        <button className="btn btn-primary" onClick={()=>nav("create")}>+ New space</button>
      </div>
      {busy&&<div style={{textAlign:"center",padding:56,color:"var(--text3)"}}>Loading…</div>}
      {!busy&&spaces.length===0&&(
        <div className="empty">
          <span className="empty-i">📭</span>
          <div className="empty-t">No spaces yet</div>
          <p className="empty-p" style={{marginBottom:20}}>Create your first space and start collecting genuine, anonymous feelings.</p>
          <button className="btn btn-primary" onClick={()=>nav("create")}>Create your first space →</button>
        </div>
      )}
      {!busy&&spaces.map(s=>{
        const exp=isExp(s),tl=ttl(s.expiresAt);
        return(
          <div className="s-item" key={s.id}>
            <div style={{flex:1,minWidth:0}}>
              <div className="s-name">{s.name}</div>
              <div className="s-meta">
                <span style={{fontFamily:"monospace",letterSpacing:".05em"}}>{s.id}</span>
                <span>·</span>
                {exp?<span className="status st-closed"><span className="st-dot"/>Closed</span>:<span className="status st-live"><span className="st-dot"/>Live {tl&&`· ${tl} left`}</span>}
                {(s.tc||0)>0&&<span style={{color:"var(--red)",fontSize:".72rem",fontWeight:500}}>⚠ {s.tc} blocked</span>}
                {s.disc&&<span style={{color:"var(--teal)",fontSize:".72rem",fontWeight:500}}>💬 Discussion on</span>}
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={()=>open(s)}>Open →</button>
          </div>
        );
      })}
    </div></div>
  );
}

/* ─── CREATE SPACE ─── */
function CreateSpace({user,onDone}){
  const[name,setName]=useState("");
  const[id,setId]=useState(uid6());
  const[pass,setPass]=useState("");
  const[desc,setDesc]=useState("");
  const[dur,setDur]=useState(DURATIONS[0].v);
  const[disc,setDisc]=useState(true);
  const[err,setErr]=useState("");
  const[busy,setBusy]=useState(false);
  const handle=async()=>{
    if(!name.trim())return setErr("Space name is required.");
    if(id.length<4)return setErr("Session ID must be at least 4 characters.");
    if(pass.length<4)return setErr("Password must be at least 4 characters.");
    setErr(""); setBusy(true);
    const SID=id.toUpperCase();
    const ex=await storageGet(`session:${SID}`);
    if(ex){setErr("This ID is already taken.");setBusy(false);return;}
    const s={id:SID,name:name.trim(),desc:desc.trim(),ph:hash(pass),owner:user.email,created:Date.now(),expiresAt:dur?Date.now()+dur:null,tc:0,disc};
    await storageSet(`session:${SID}`,s); await storageSet(`feeds:${SID}`,[]);
    const ids=await storageGet(`spaces:${user.email}`)||[];
    await storageSet(`spaces:${user.email}`,[...ids,SID]);
    onDone(s); setBusy(false);
  };
  return(
    <div className="page"><div className="narrow">
      <div className="card">
        <div className="card-t">New space</div>
        <div className="card-s">Voices can join with just a code — no account needed on their end.</div>
        {err&&<div className="alert a-err">⚠️ {err}</div>}
        <div className="field"><label>Space name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Team check-in, Friend circle…"/></div>
        <div className="field-row">
          <div className="field"><label>Session ID</label><input value={id} onChange={e=>setId(e.target.value.toUpperCase().replace(/\s/g,""))} maxLength={10}/><div className="field-hint">Voices use this to find you</div></div>
          <div className="field"><label>Password</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="4+ characters"/><div className="field-hint">Share with voices</div></div>
        </div>
        <div className="field"><label>Prompt <span style={{fontWeight:400,color:"var(--text3)"}}>— optional</span></label><input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What do you want people to share?"/></div>
        <div className="field"><label>Auto-close after</label>
          <select value={dur??"null"} onChange={e=>setDur(e.target.value==="null"?null:Number(e.target.value))}>
            {DURATIONS.map(d=><option key={String(d.v)} value={d.v??"null"}>{d.label}</option>)}
          </select>
          <div className="field-hint">All feelings are saved permanently after closing.</div>
        </div>
        <div className="tog-row">
          <div><div className="tog-label">Allow anonymous discussion</div><div className="tog-desc">Voices get a private token to chat with you after sharing. They stay Voice #N — never identified.</div></div>
          <label className="tog"><input type="checkbox" checked={disc} onChange={e=>setDisc(e.target.checked)}/><span className="tog-track"/></label>
        </div>
        <button className="btn btn-primary btn-full" onClick={handle} disabled={busy}>{busy?"Creating…":"Create space →"}</button>
      </div>
    </div></div>
  );
}

/* ─── SPACE READY ─── */
function SpaceReady({session,nav,copyCode,copied}){
  const tl=ttl(session.expiresAt);
  return(
    <div className="page"><div className="narrow">
      <div className="card" style={{textAlign:"center"}}>
        <div className="pop" style={{fontSize:"2rem",marginBottom:10}}>🎉</div>
        <div className="card-t">Space is live</div>
        <div className="card-s">Share this code anywhere — WhatsApp, Instagram, your group chat. No account needed to respond.</div>
        <div className="code-box"><div className="code-lbl">Session code</div><div className="code-val">{session.id}</div>{tl&&<div className="code-note">Closes in {tl}</div>}</div>
        <div className="banner bn-warm" style={{textAlign:"left",marginBottom:12}}><span>🤖</span><div>AI moderation active — abuse is blocked, honest feelings always get through.</div></div>
        {session.disc&&<div className="banner bn-teal" style={{textAlign:"left",marginBottom:16}}><span>💬</span><div>Discussion <strong>enabled</strong> — voices receive a private token to chat with you after sharing.</div></div>}
        <div className="btn-row" style={{marginTop:4}}>
          <button className="btn btn-secondary" onClick={()=>copyCode(session.id)}>{copied?"✓ Copied":"Copy code"}</button>
          <button className="btn btn-primary" onClick={()=>nav("session")}>View dashboard →</button>
        </div>
      </div>
    </div></div>
  );
}

/* ─── JOIN ─── */
function JoinSpace({onJoined}){
  const[id,setId]=useState("");const[pass,setPass]=useState("");const[err,setErr]=useState("");const[busy,setBusy]=useState(false);
  const handle=async()=>{
    if(!id.trim())return setErr("Enter a Session ID.");
    if(!pass.trim())return setErr("Enter the password.");
    setErr(""); setBusy(true);
    const s=await storageGet(`session:${id.toUpperCase()}`);
    if(!s){setErr("Session not found. Check the code and try again.");setBusy(false);return;}
    if(isExp(s)){setErr("This session has closed and is no longer accepting responses.");setBusy(false);return;}
    if(s.ph!==hash(pass)){setErr("Incorrect password. Ask the session creator.");setBusy(false);return;}
    if(localStorage.getItem(`wv_${s.id}`)){setErr("You've already shared your thoughts in this session.");setBusy(false);return;}
    onJoined(s); setBusy(false);
  };
  return(
    <div className="page"><div className="narrow">
      <div className="card">
        <div className="card-t">Join a space</div>
        <div className="card-s">No account needed. Enter the code and password to share your thoughts anonymously.</div>
        <div className="alert a-info"><span>🛡️</span><span>Your identity is never stored — no name, email, or IP, ever.</span></div>
        {err&&<div className="alert a-err">⚠️ {err}</div>}
        <div className="field"><label>Session ID</label><input value={id} onChange={e=>setId(e.target.value.toUpperCase().replace(/\s/g,""))} placeholder="e.g. AB12CD" maxLength={10}/></div>
        <div className="field"><label>Password</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Provided by the session creator" onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
        <button className="btn btn-primary btn-full" onClick={handle} disabled={busy}>{busy?"Checking…":"Enter space →"}</button>
      </div>
    </div></div>
  );
}

/* ─── SUBMIT ─── */
function SubmitScreen({session,onDone}){
  const[msg,setMsg]=useState("");const[mood,setMood]=useState(null);
  const[err,setErr]=useState("");const[busy,setBusy]=useState(false);
  const[checking,setChecking]=useState(false);const[flagged,setFlagged]=useState(false);
  const handle=async()=>{
    if(msg.trim().length<5)return setErr("Please write at least a few words.");
    setErr(""); setFlagged(false); setBusy(true);
    setChecking(true); const tox=await checkTox(msg); setChecking(false);
    if(tox){
      const s=await storageGet(`session:${session.id}`);
      if(s){s.tc=(s.tc||0)+1;await storageSet(`session:${session.id}`,s);}
      setFlagged(true); setBusy(false); return;
    }
    try{
      const feeds=await storageGet(`feeds:${session.id}`)||[];
      const vn=feeds.length+1; const tok=mktoken(); const fid=uid();
      feeds.push({id:fid,vn,tok,msg:msg.trim(),mood,ts:Date.now()});
      await storageSet(`feeds:${session.id}`,feeds);
      localStorage.setItem(`wv_${session.id}`,JSON.stringify({vn,tok,sid:session.id}));
      onDone();
    }catch{ setErr("Something went wrong. Please try again."); }
    setBusy(false);
  };
  return(
    <div className="page"><div className="mid">
      <div className="card">
        <div className="card-t">{session.name}</div>
        <div className="card-s">{session.desc||"Your anonymous space. Share what you genuinely feel or think."}</div>
        <div className="nudge"><div className="nudge-t">Keep it real — keep it respectful</div><div className="nudge-p">Honest, even harsh feelings are always welcome. Focus on what the person could improve or how they made you feel. Personal attacks will be blocked by AI — you'll get a chance to rephrase.</div></div>
        {flagged&&<div className="flagged"><span className="flagged-i">🚫</span><div className="flagged-t">Message blocked by AI</div><div className="flagged-p">Detected as abusive and permanently deleted — never saved. Try expressing your feelings constructively. Honest and blunt is always fine here.</div></div>}
        {checking&&<div className="checking"><div className="spinner"/><span style={{fontSize:".8rem",color:"var(--text2)"}}>AI is reviewing your message…</span></div>}
        {err&&<div className="alert a-err">⚠️ {err}</div>}
        <div className="field">
          <label>How would you describe this? <span style={{fontWeight:400,color:"var(--text3)"}}>— optional</span></label>
          <div className="mood-grid">{MOODS.map(m=>(<button key={m.key} className={`mood-btn ${mood===m.key?"on":""}`} onClick={()=>setMood(mood===m.key?null:m.key)}><span>{m.icon}</span><span>{m.label}</span></button>))}</div>
        </div>
        <div className="field"><label>Your feelings & thoughts</label><textarea rows={5} value={msg} onChange={e=>{setMsg(e.target.value);if(flagged)setFlagged(false);}} placeholder={flagged?"Try again — express how you feel, constructively…":"Be honest. This is completely anonymous — nothing is traced back to you."}/></div>
        <button className="btn btn-primary btn-full" onClick={handle} disabled={busy||checking||msg.trim().length<5}>{checking?"Reviewing…":busy?"Sharing…":flagged?"Try again →":"Share anonymously →"}</button>
        <p style={{textAlign:"center",marginTop:10,fontSize:".71rem",color:"var(--text3)"}}>🕵️ Completely anonymous — your identity is never stored</p>
      </div>
    </div></div>
  );
}

/* ─── DONE ─── */
function DoneScreen({nav}){
  const[info,setInfo]=useState(null);
  useEffect(()=>{
    for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k?.startsWith("wv_")){ try{setInfo(JSON.parse(localStorage.getItem(k)));}catch{} break; } }
  },[]);
  return(
    <div className="page"><div className="narrow">
      <div className="card" style={{textAlign:"center"}}>
        <div className="pop" style={{fontSize:"2.2rem",marginBottom:12}}>🎤</div>
        <div className="card-t">Voice heard</div>
        <p style={{fontSize:".875rem",color:"var(--text2)",lineHeight:1.75,marginBottom:16}}>Your feelings were delivered safely and anonymously.{info&&<> You are <strong style={{color:"var(--orange)"}}>Voice #{info.vn}</strong>.</>}</p>
        {info&&<div className="token-box"><div className="token-lbl">🔑 Your discussion token</div><div className="token-val">{info.tok}</div><div className="token-note">Save this. Use it to access your anonymous discussion with the session creator. It won't be shown again.</div></div>}
        {info&&<div className="alert a-teal" style={{textAlign:"left",marginBottom:16}}><span>💬</span><span>To discuss with the creator, tap <strong>"Access my discussion"</strong> on the home page and enter your Session ID + this token.</span></div>}
        <div className="btn-row" style={{flexDirection:"column"}}>
          {info&&<button className="btn btn-teal btn-full" onClick={()=>nav("chat-v")}>Open my discussion →</button>}
          <button className="btn btn-secondary btn-full" onClick={()=>nav("home")}>Back to home</button>
        </div>
        <p style={{marginTop:14,fontSize:".71rem",color:"var(--text3)"}}>Thank you for being honest. It takes courage.</p>
      </div>
    </div></div>
  );
}

/* ─── VOICE CHAT ─── */
function VoiceChat({nav}){
  const[step,setStep]=useState("enter");
  const[sid,setSid]=useState("");const[tok,setTok]=useState("");const[err,setErr]=useState("");const[busy,setBusy]=useState(false);
  const[vn,setVn]=useState(null);const[sessObj,setSessObj]=useState(null);
  const[msgs,setMsgs]=useState([]);const[input,setInput]=useState("");const[sending,setSending]=useState(false);
  const btm=useRef(null);
  useEffect(()=>{ for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k?.startsWith("wv_")){ try{const d=JSON.parse(localStorage.getItem(k));setSid(d.sid||"");setTok(d.tok||"");}catch{} break; } } },[]);
  useEffect(()=>{ btm.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);
  const enter=async()=>{
    if(!sid.trim()||!tok.trim())return setErr("Enter both fields.");
    setErr(""); setBusy(true);
    const s=await storageGet(`session:${sid.toUpperCase()}`);
    if(!s){setErr("Session not found.");setBusy(false);return;}
    if(!s.disc){setErr("Discussion is not enabled for this session.");setBusy(false);return;}
    const feeds=await storageGet(`feeds:${sid.toUpperCase()}`)||[];
    const fb=feeds.find(f=>f.tok===tok.trim().toUpperCase());
    if(!fb){setErr("Token not found. Please check and try again.");setBusy(false);return;}
    setVn(fb.vn); setSessObj(s);
    const thread=await storageGet(`chat:${s.id}:${fb.vn}`)||[];
    setMsgs(thread); setStep("chat"); setBusy(false);
  };
  const send=async()=>{
    if(!input.trim()||!sessObj||vn===null)return; setSending(true);
    const thread=await storageGet(`chat:${sessObj.id}:${vn}`)||[];
    thread.push({from:"v",text:input.trim(),ts:Date.now()});
    await storageSet(`chat:${sessObj.id}:${vn}`,thread);
    setMsgs([...thread]); setInput(""); setSending(false);
  };
  if(step==="enter")return(
    <div className="page"><div className="narrow">
      <div className="card">
        <div className="card-t">Access discussion</div>
        <div className="card-s">Enter your Session ID and the token you received after sharing your feelings.</div>
        <div className="alert a-teal"><span>🕵️</span><span>You remain completely anonymous. The creator only knows you as "Voice #N".</span></div>
        {err&&<div className="alert a-err">⚠️ {err}</div>}
        <div className="field"><label>Session ID</label><input value={sid} onChange={e=>setSid(e.target.value.toUpperCase().replace(/\s/g,""))} placeholder="e.g. AB12CD" maxLength={10}/></div>
        <div className="field"><label>Discussion token</label><input value={tok} onChange={e=>setTok(e.target.value.toUpperCase().replace(/\s/g,""))} placeholder="e.g. VA3X9B"/><div className="field-hint">The token shown to you after submitting</div></div>
        <button className="btn btn-teal btn-full" onClick={enter} disabled={busy}>{busy?"Checking…":"Open discussion →"}</button>
      </div>
    </div></div>
  );
  return(
    <div className="page-top"><div className="mid" style={{margin:"0 auto"}}>
      <div className="card">
        <div className="chat-head">
          <div style={{fontFamily:"var(--serif)",fontStyle:"italic",fontSize:"1.2rem",marginBottom:4}}>Discussion thread</div>
          <p style={{fontSize:".77rem",color:"var(--text3)"}}>{sessObj?.name} · You are <strong style={{color:"var(--orange)"}}>Voice #{vn}</strong> · Fully anonymous</p>
        </div>
        <div className="chat-msgs">
          {msgs.length===0&&<div className="chat-empty">No messages yet — start the conversation 💬</div>}
          {msgs.map((m,i)=>(<div key={i} className={`bubble ${m.from==="v"?"mine":"theirs"}`}><div className="bubble-text">{m.text}</div><div className="bubble-time">{timeAgo(m.ts)}</div></div>))}
          <div ref={btm}/>
        </div>
        <div className="chat-input-row">
          <textarea className="chat-ta" rows={2} value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your message… (Enter to send)" onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }}/>
          <button className="btn btn-primary" onClick={send} disabled={sending||!input.trim()} style={{padding:"0 16px",alignSelf:"stretch"}}>{sending?"…":"Send"}</button>
        </div>
      </div>
    </div></div>
  );
}

/* ─── CREATOR CHAT ─── */
function CreatorChat({session,vn}){
  const[msgs,setMsgs]=useState([]);const[input,setInput]=useState("");const[sending,setSending]=useState(false);
  const btm=useRef(null);
  useEffect(()=>{ (async()=>{ const t=await storageGet(`chat:${session.id}:${vn}`)||[]; setMsgs(t); })(); },[]);
  useEffect(()=>{ btm.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);
  const send=async()=>{
    if(!input.trim())return; setSending(true);
    const thread=await storageGet(`chat:${session.id}:${vn}`)||[];
    thread.push({from:"c",text:input.trim(),ts:Date.now()});
    await storageSet(`chat:${session.id}:${vn}`,thread);
    setMsgs([...thread]); setInput(""); setSending(false);
  };
  return(
    <div className="page-top"><div className="mid" style={{margin:"0 auto"}}>
      <div className="card">
        <div className="chat-head">
          <div style={{fontFamily:"var(--serif)",fontStyle:"italic",fontSize:"1.2rem",marginBottom:4}}>Voice #{vn}</div>
          <p style={{fontSize:".77rem",color:"var(--text3)"}}>{session.name} · This voice is fully anonymous</p>
        </div>
        <div className="chat-msgs">
          {msgs.length===0&&<div className="chat-empty">No messages yet — send the first one 💬</div>}
          {msgs.map((m,i)=>(<div key={i} className={`bubble ${m.from==="c"?"mine":"theirs"}`}><div className="bubble-text">{m.text}</div><div className="bubble-time">{timeAgo(m.ts)}</div></div>))}
          <div ref={btm}/>
        </div>
        <div className="chat-input-row">
          <textarea className="chat-ta" rows={2} value={input} onChange={e=>setInput(e.target.value)} placeholder="Reply to Voice #…" onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }}/>
          <button className="btn btn-primary" onClick={send} disabled={sending||!input.trim()} style={{padding:"0 16px",alignSelf:"stretch"}}>{sending?"…":"Send"}</button>
        </div>
      </div>
    </div></div>
  );
}

/* ─── SESSION DASHBOARD ─── */
function SessionDash({session,feeds,reload,copyCode,copied,onExport,onChat}){
  const[refreshing,setRefreshing]=useState(false);const[filter,setFilter]=useState("all");const[local,setLocal]=useState(session);
  useEffect(()=>{ (async()=>{ const s=await storageGet(`session:${session.id}`); if(s)setLocal(s); })(); },[feeds]);
  const refresh=async()=>{ setRefreshing(true); await reload(); const s=await storageGet(`session:${session.id}`); if(s)setLocal(s); setTimeout(()=>setRefreshing(false),500); };
  const exp=isExp(local),tl=ttl(local.expiresAt),tc=local.tc||0;
  const shown=filter==="all"?feeds:feeds.filter(f=>f.mood===filter);
  const avg=feeds.length>0?Math.round(feeds.reduce((a,f)=>a+f.msg.split(/\s+/).length,0)/feeds.length):0;
  return(
    <div className="page-top"><div className="full">
      <div style={{marginBottom:22}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,flexWrap:"wrap",marginBottom:6}}>
          <h1 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontSize:"clamp(1.4rem,3.5vw,1.9rem)",fontWeight:400}}>{local.name}</h1>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            {exp?<span className="status st-closed"><span className="st-dot"/>Closed</span>:<span className="status st-live"><span className="st-dot"/>Live{tl&&` · ${tl} left`}</span>}
          </div>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",fontSize:".77rem",color:"var(--text3)"}}>
          <span style={{fontFamily:"monospace",letterSpacing:".05em"}}>{local.id}</span>
          <span>·</span><span>Created {new Date(local.created).toLocaleDateString()}</span>
          {local.disc&&<><span>·</span><span style={{color:"var(--teal)"}}>💬 Discussion enabled</span></>}
        </div>
      </div>
      {exp&&<div className="banner bn-red"><span>🔒</span><div>This session is closed — no new responses. All feelings are saved permanently.</div></div>}
      {tc>0&&<div className="banner bn-amber"><span>🚫</span><div><strong>{tc} message{tc>1?"s were":" was"} blocked and permanently deleted by AI</strong>{tc>2?` ${tc} voices tried to be abusive.`:" Blocked instantly."} {tc<=2?"Most voices kept it respectful.":""}</div></div>}
      <div className="share-bar">
        <span className="share-lbl">Share code</span>
        <span className="share-code">{local.id}</span>
        <button className="btn btn-secondary btn-sm" onClick={()=>copyCode(local.id)}>{copied?"✓ Copied":"Copy"}</button>
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-val">{feeds.length}</div><div className="stat-lbl">Voices</div></div>
        <div className="stat-card"><div className="stat-val">{avg}</div><div className="stat-lbl">Avg words</div></div>
        <div className="stat-card"><div className={`stat-val ${tc>0?"danger":""}`}>{tc}</div><div className="stat-lbl">Blocked</div></div>
        <div className="stat-card"><div className="stat-val">100%</div><div className="stat-lbl">Anonymous</div></div>
      </div>
      <div className="toolbar">
        <span className="toolbar-t">Feelings shared ({shown.length})</span>
        <div className="toolbar-r">
          <select style={{fontFamily:"var(--font)",fontSize:".8rem",background:"var(--cream)",border:"1px solid var(--border2)",borderRadius:"var(--r-sm)",padding:"6px 10px",color:"var(--text)",cursor:"pointer",outline:"none"}}
            value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All types</option>
            {MOODS.map(m=><option key={m.key} value={m.key}>{m.icon} {m.label}</option>)}
          </select>
          <button className="btn btn-secondary btn-sm" onClick={refresh} disabled={refreshing}>{refreshing?"Refreshing…":"Refresh"}</button>
          <button className="btn btn-secondary btn-sm" onClick={onExport} disabled={feeds.length===0}>Export PDF</button>
        </div>
      </div>
      {shown.length===0
        ?<div className="empty"><span className="empty-i">{feeds.length===0?"🗣️":"🔍"}</span><div className="empty-t">{feeds.length===0?"No voices yet":"Nothing matches this filter"}</div><p className="empty-p">{feeds.length===0?"Share your session code — voices can respond instantly, no login needed.":"Try selecting a different type."}</p></div>
        :<div className="fb-list">
          {[...shown].reverse().map((fb,i)=>{
            const m=MOODS.find(x=>x.key===fb.mood);
            return(
              <div className="fb-card" key={fb.id} style={{animationDelay:`${i*.04}s`}}>
                <div className="fb-head">
                  <span className="v-badge">Voice #{fb.vn}</span>
                  <span className={`m-badge ${m?m.cls:"mb-general"}`}>{m?<>{m.icon} {m.label}</>:"General"}</span>
                </div>
                <div className="fb-text">{fb.msg}</div>
                <div className="fb-foot">
                  <span className="fb-time">{fmtDate(fb.ts)}</span>
                  <div className="fb-acts">
                    {local.disc&&<button className="chip chip-teal" onClick={()=>onChat(fb.vn)}>💬 Chat with Voice #{fb.vn}</button>}
                    <span className="chip">🕵️ Anon</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>}
    </div></div>
  );
}