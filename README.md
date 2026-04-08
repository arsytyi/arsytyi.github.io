# Artem Sytyi — Portfolio Website

Modern, animated landing page for a User Acquisition Manager.

## Quick Start

Open `index.html` in your browser — no build step required.

For local development with live reload, use any static server:

```bash
# Python
python3 -m http.server 8080

# Node.js (npx)
npx serve .
```

## Project Structure

```
artem-sytyi-portfolio/
├── index.html              # Main landing page
├── css/
│   └── style.css           # All styles, animations, responsive
├── js/
│   └── main.js             # Interactions, scroll reveal, dynamic loader
└── assets/
    ├── images/
    │   ├── profile.jpg      # Your profile photo (auto-detected)
    │   ├── portfolio/       # Project thumbnails (auto-loaded)
    │   └── icons/           # Custom icons
    ├── videos/              # Project videos (.mp4, .webm)
    ├── pdfs/                # Project PDFs and CV
    │   └── Artem_Sytyi_CV.pdf
    └── fonts/               # Custom font files (if needed)
```

## Adding Portfolio Items

Place files in the `assets/` folders. The dynamic loader auto-discovers them.

### Naming Convention

Use matching base filenames across directories:

```
assets/images/portfolio/project-1.jpg    # thumbnail
assets/pdfs/project-1.pdf                # document
assets/videos/project-1.mp4             # video
```

Supported patterns: `project-1`, `project-2`, ... `project-20`

### Manual Projects

The two main projects (Loyalty Analysis, TaskFlow Unit Economics) are
hardcoded in `index.html`. To add their visuals:

```
assets/images/portfolio/loyalty-analysis.jpg
assets/pdfs/loyalty-analysis.pdf
assets/images/portfolio/taskflow-unit-economics.jpg
assets/pdfs/taskflow-unit-economics.pdf
```

## Customization

- **Profile photo:** Drop `profile.jpg` into `assets/images/`
- **Colors:** Edit CSS variables in `:root` block in `css/style.css`
- **Phone number:** Update the `tel:` link in the Contact section of `index.html`
- **LinkedIn URL:** Update the LinkedIn `href` in the Contact section
