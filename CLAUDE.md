@AGENTS.md

# Language

**Code is English, the interface is German.**

English:

- File and directory names (`upload-form.tsx`, not `upload-formular.tsx`)
- Function, variable and type names (`registerOrder`, not `registriereVorgang`)
- Database and storage: tables, columns, schemas, functions, policies, buckets
- Code comments
- Commit messages

German:

- Everything a customer reads: page copy, emails, error messages

The line runs at the edge of the screen: what someone sees is German, what
developers work on is English.

## Existing code

Parts of the tree are still named in German — `vorgang.ts`,
`upload-formular.tsx`, `meldeUnterlagenEingegangen` and others. That is legacy
from the start of the project. New code is named in English; existing names are
changed when the code is touched anyway, not in a pass of their own.
