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
- **RSVP**: the form posts to Netlify Forms. Locally it shows the success state without sending.

## Deploying on Netlify

1. In Netlify, choose **Add new site → Import an existing project** and pick this repository.
2. Leave the build command empty and set the publish directory to `.` (both are already in `netlify.toml`).
3. Deploy. The RSVP form is a Netlify Form named `rsvp`; submissions appear under **Site → Forms** in the Netlify dashboard, where you can also turn on email notifications.
