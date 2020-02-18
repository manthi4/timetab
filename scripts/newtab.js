chrome.storage.local.get([
  'scheme'
], function(results) {
  const { scheme } = results;
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  const mode = query.matches ? 'dark' : 'light';

  document.body.setAttribute('class', scheme);

  if(scheme !== mode) {
    chrome.browserAction.setIcon({
      'path': {
        '32': `images/${mode}/32.png`,
        '48': `images/${mode}/48.png`,
        '96': `images/${mode}/96.png`,
        '128': `images/${mode}/128.png`
      }
    });

    chrome.storage.local.set({
      'scheme': mode
    });
  }
});

chrome.storage.sync.get([
  'clocks',
  'settings'
], function(results) {
  const { clocks, settings } = results;
  const main = document.querySelector('#clocks');
  const template = main.querySelector('#clock');
  const hand = document.createElement('hr');
  const button = document.querySelector('#options');

  button.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });

  clocks.forEach(clock => {
    const clone = template.content.cloneNode(true);

    if(clock.timeZone.includes('/')) {
      clone.querySelector('time').timeZone = clock.timeZone;
    }

    if(settings.labels) {
      clone.querySelector('label').textContent = clock.label;
    } else {
      clone.querySelector('label').remove();
    }

    main.appendChild(clone);
  });

  setInterval(function update() {
    const date = new Date;
    const seconds = date.getSeconds();
    const degree = Math.round(360 * seconds / 60);

    main.querySelectorAll('time').forEach(time => {
      time.innerHTML = date.toLocaleTimeString('en-US', {
        'timeZone': time.timeZone || undefined,
        'hour12': !settings.hour24,
        'hour': 'numeric', 
        'minute': 'numeric'
      });
    });

    hand.style.transform = `rotate(${degree}deg)`;

    return update;
  }(), 1000);

  main.appendChild(hand);
});