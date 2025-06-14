# waitlist-backend

- Implemented an auth system using secure HTTP only cookies.
- Implemented scalable DB structure to accodmodate different types of use cases of transactions.

## How to run locally
- Create a `.env.development` file and add all the fields states in `.env.sample`
- Run `pnpm run migrate`
- Run `pnpm run dev`

## Project structure
I have used an app based system in which routes are grouped together.
We have all the payload validation and authetication checks in the middleware using zod.
Routes call controller to implement the core logic.

## System requirements
- Use node version >= 20

## DB Architecture and additional Info
https://www.notion.so/TechFin-20f84e54355a8066ac06e0fb7a2b4aa7?source=copy_link
