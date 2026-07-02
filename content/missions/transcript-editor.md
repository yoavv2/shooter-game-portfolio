---
name: Transcript Editor
rarity: EPIC
blurb: Transcribe YouTube & media, edit transcripts, swap thumbnails and titles
progress: 100
order: 2
stack:
  - Next.js
  - Supabase
# liveUrl: https://transcript-editor.example.com
# repoUrl: https://github.com/yoavv2/transcript-editor
---

## OBJECTIVE

Creators need to fix auto-generated transcripts and iterate on video
packaging (titles, thumbnails) without leaving one tool.

## EXECUTION

- Media ingestion: paste a YouTube URL or upload audio, get a transcript.
- Inline transcript editor with timestamp-synced playback.
- Thumbnail and title variants managed per video for quick A/B swaps.
- Supabase handles auth, storage, and persistence.

## FIELD NOTES

Main challenge: keeping long transcripts responsive in the editor —
chunked rendering and debounced saves keep typing smooth on hour-long videos.

## OUTCOME

Shipped. Full transcribe → edit → publish loop in one interface.
