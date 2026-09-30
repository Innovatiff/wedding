# Alam & Astrid — Wedding Website

A single-page wedding site for Alam and Astrid, June 25. Pure HTML, CSS and vanilla JavaScript with no build step.

## Run it

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Structure

- `index.html` — page content and sections
- `styles.css` — design system (white, silver and royal blue only), layout and animations
- `script.js` — countdown, scroll reveals, particles, tilt cards, RSVP form
- `assets/logo.png` — the A & A monogram with a transparent background

## Customising

- **Wedding time**: the countdown targets the next June 25 at 4:00 pm local time. Change the hour in `nextWeddingDate()` in `script.js`.
- **Venue, hotels, story**: edit the text directly in `index.html`.
- **Photos**: the gradient placeholder frames (`.photo__frame`, `.dress__frame`) can be replaced with `<img>` tags.
- **RSVP**: the form currently shows a success state locally. Replace the `setTimeout` in the submit handler in `script.js` with a request to your form service.
