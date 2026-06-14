import { CMS_READY_SELECTOR } from '../lib/admin';

const help = document.querySelector<HTMLElement>('#cms-help');

if (help) {
  const hideHelpWhenReady = () => {
    if (!document.querySelector(CMS_READY_SELECTOR)) return false;

    help.hidden = true;
    return true;
  };

  if (!hideHelpWhenReady()) {
    const observer = new MutationObserver(() => {
      if (!hideHelpWhenReady()) return;
      observer.disconnect();
    });

    observer.observe(document.body, { childList: true });
    window.setTimeout(() => observer.disconnect(), 30_000);
  }
}
