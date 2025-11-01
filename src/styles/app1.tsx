@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
@import './tokens.css';

html,
body {
  height: 100%;
}

body {
  margin: 0;
  background-color: var(--scene-bg);
  color: var(--ui-ink);
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.45;
  overflow: hidden;
}

#root {
  height: 100%;
}
