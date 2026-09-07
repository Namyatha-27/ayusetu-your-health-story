# AyuSetu: Your Health Story

Build a modern, professional healthcare web application called AyuSetu.

PRODUCT PURPOSE

AyuSetu is an AI-assisted Patient Case Taking and Care Continuity Platform.

The goal is to make patient case-taking faster, more structured, accessible, and useful for doctors.

IMPORTANT:

AyuSetu does NOT replace doctors.

AyuSetu must NOT diagnose diseases.

AyuSetu must NOT prescribe medicines.

AyuSetu must NOT provide online prescriptions.

Prescriptions and medical treatment happen offline during the physical doctor consultation.

AI is used only to assist with information collection, organization, summarization, and relevant follow-up questions.

1. LANDING PAGE

Create a beautiful, clean, premium healthcare landing page.

Brand:
AyuSetu

Tagline:
"Your Health Story, Clearly Understood."

Supporting text:
"AI-assisted patient case taking that helps patients share their health information and helps doctors prepare for better consultations."

The landing page should have:

AyuSetu logo/wordmark

Home

How It Works

Features

About

Login

Get Started

Main CTA:
Get Started

Secondary CTA:
How It Works

Show three role cards:

Patient

"Share your symptoms, complete your digital case, manage follow-ups and access your medical history."

Doctor

"Review structured patient cases, previous history and follow-up information before consultation."

Hospital Management

"Manage doctors, patients, hospital information and case workflows."

Also include a clearly visible but tasteful:

🚨 Emergency Help

Emergency section should explain:
"For medical emergencies, seek immediate medical attention. Emergency cases should not be delayed by digital case taking."

Do not make the landing page cluttered.

2. DESIGN SYSTEM

Make the website look like a real healthcare startup, NOT a college project.

Use:

White / very light background

Professional teal and deep blue accents

Clean cards

Rounded corners

Subtle shadows

Modern typography

Excellent spacing

Minimal animations

Accessible contrast

Responsive design for desktop, tablet and mobile

Use a consistent design system throughout the application.

Avoid excessive gradients, excessive animations, childish illustrations, or too many colors.

3. ROLE SELECTION

When the user clicks Get Started or Login, show:

How would you like to continue?

👤 Patient

👨‍⚕️ Doctor

🏥 Hospital Management

Each role should lead to its own authentication/dashboard flow.

4. PATIENT SYSTEM

Create a patient authentication flow with:

Sign up

Login

Logout

Patient profile

Unique Patient ID

Patient profile should contain:

Name

Date of birth / age

Gender

Contact information

Basic medical information

The patient should be able to manage multiple family member profiles.

Example:

My Profiles:

Namyatha — PT-10234

Grandfather — PT-10891

Add Family Member

Each family member must have a completely separate Patient ID and separate medical history.

5. PATIENT DASHBOARD

After login, create a clean patient dashboard.

Show:

"Welcome back, [Patient Name]"

Current patient profile.

My Doctor

Doctor name
Hospital
Department

Quick Actions

Start New Case

Follow-up

Medical History

Visits

Family Profiles

My Doctor

Emergency Help

The patient should not have to repeatedly select their doctor and hospital.

6. HOSPITAL AND PREFERRED DOCTOR

For a new patient, allow them to:

Select/search a hospital.

Select a doctor from that hospital.

Save that doctor as their preferred doctor.

Store the relationship:

Patient → Hospital → Preferred Doctor

On future visits, automatically show:

"My Doctor"
[Doctor Name]
[Hospital]

Allow:
Change Doctor

If the doctor is unavailable, allow the patient to select another available doctor.

For the initial prototype, use realistic sample hospitals/doctors rather than requiring real hospital integrations.

7. NEW CASE FLOW

When the patient selects:

Start New Case

Create an intelligent case-taking interface.

First ask:

"What brings you here today?"

Allow:

Text input

Voice input UI placeholder

Language selection

The patient should be able to explain their problem naturally.

Example:
"I have been having fever for three days and body pain."

The AI case-taking interface should then ask relevant follow-up questions.

IMPORTANT:
The questions should be adaptive rather than showing a giant static questionnaire.

The system should collect structured information such as:

Chief complaint

Duration

Symptoms

Severity

Relevant history

Past medical history

Allergies

Current medications

Family history

Other relevant information

Do NOT allow AI to diagnose or prescribe.

8. MULTILINGUAL SUPPORT

Design the case-taking interface with language selection.

Initially support:

English

Telugu

Hindi

The architecture should allow additional Indian languages later.

The patient's responses should ultimately be converted into a standardized structured case for the doctor.

9. VOICE INPUT

Add a voice input interface:

🎤 "Speak your symptoms"

For the initial frontend prototype, create the complete UI and interaction state.

Structure the code so speech-to-text can be connected later.

10. CASE SUMMARY

After case taking, automatically display:

Patient Case Summary

Patient information

Chief Complaint

Duration

Symptoms

Medical History

Allergies

Current Medications

Family History

Other Relevant Information

Also show:

AI Summary

A short, doctor-friendly summary of the patient's information.

Example:

"21-year-old patient presenting with fever for three days associated with body pain. No vomiting reported."

Clearly label this as an AI-generated summary that requires doctor verification.

11. MISSING INFORMATION

Before submitting the case, show a case completeness indicator.

Example:

Case Completeness: 85%

Show missing information such as:

⚠ Allergy information not provided
⚠ Current medication information not provided

Allow the patient to add missing information before submission.

Do not prevent submission unless absolutely necessary.

12. SUBMIT CASE

Button:

Send Case to Doctor

After submission show:

"Case submitted successfully."

Display:

Patient

Hospital

Preferred Doctor

Case ID

Submission status

13. DOCTOR DASHBOARD

Create a professional doctor dashboard.

Show:

New Cases

Pending Review

Reviewed Cases

Today's Visits

Follow-ups

Patient case list should show:

Patient Name
Patient ID
Complaint
New / Follow-up
Status
Date

14. DOCTOR CASE VIEW

When a doctor opens a case, show:

Patient Information

Current Case

AI Summary

Structured Case

Missing Information

Previous Medical History

Case Timeline

Doctor actions:

Review

Edit information

Add clinical notes

Request clarification

Mark Case Reviewed

The doctor must be able to correct AI-generated information.

15. PHYSICAL CONSULTATION FLOW

After the doctor reviews the case:

Patient receives:

"Your case has been reviewed by Dr. [Name]. Please visit the hospital for your consultation."

Optionally allow appointment scheduling.

The actual consultation happens physically.

The doctor examines the patient and makes the medical decision.

Show consultation status:

Case Submitted

Doctor Reviewed

Consultation Pending

Consultation Completed

IMPORTANT:
Do NOT create online diagnosis or online prescription functionality.

16. PRESCRIPTION RULE

AyuSetu should NOT provide online prescriptions.

Do NOT build:

AI medicine recommendations

AI prescriptions

Online medicine ordering

Prescription and treatment happen offline after the doctor physically examines the patient.

The system may only record:
Consultation Completed

17. FOLLOW-UP FLOW

This is a major feature.

When an existing patient logs in again, show:

Welcome back, [Name]

Automatically show their preferred doctor and hospital.

Options:

🔄 Follow-up

➕ New Case

For a follow-up, load the previous case.

Do NOT make the patient fill the entire case again.

Instead ask:

Has your condition improved?

Are your previous symptoms still present?

Have you developed any new symptoms?

Have there been any changes?

Are there any concerns since your previous consultation?

Generate a follow-up summary containing:

Previous Case
Current Status
New Symptoms
Changes
Relevant Updates

Send the follow-up to the same preferred doctor by default.

18. MEDICAL HISTORY

Create a patient medical timeline.

Example:

September 2026
Fever
Dr. Ravi Kumar
Consultation completed

June 2026
Cough
Dr. Ravi Kumar
Consultation completed

Allow doctors to see authorized previous cases as well.

19. EMERGENCY MODE

Create a separate emergency flow.

The emergency button should always be easily accessible.

When clicked:

Show:

🚨 EMERGENCY

"Do not wait for digital case taking in a medical emergency. Seek immediate medical attention."

Provide UI for:

Emergency services

Find emergency hospital

Hospital contact

Emergency location assistance

Do NOT make the patient complete the normal AI case-taking process before getting emergency help.

If an emergency case is submitted to the hospital system, mark it:

🚨 EMERGENCY — HIGH PRIORITY

20. HOSPITAL MANAGEMENT DASHBOARD

Create a simple hospital management dashboard.

Show:

Doctors

Patients

Departments

Doctor availability

Hospital information

Case statistics

Emergency cases

Keep management functionality simple for the prototype.

21. SECURITY AND ACCESS

Design the application around role-based access.

Patient:

Can access their own records and family profiles they manage.

Doctor:

Can access cases they are authorized to review.

Management:

Can manage appropriate hospital-level information.

Include:

Authentication

Logout

Protected dashboard routes

Role-based navigation

Consent before sharing patient case information

Use realistic demo data only.

22. DATABASE ARCHITECTURE

Prepare the project to use Supabase.

Create a clean database structure for:

users

patient_profiles

family_profiles

hospitals

doctors

patient_doctor_relationships

cases

case_responses

case_summaries

follow_ups

consultations

notifications

Use proper relationships between patient, hospital, doctor and cases.

Do not mix medical records between family members.

23. IMPORTANT PRODUCT PRINCIPLES

AyuSetu is:

Patient Case Taking + Doctor Preparation + Medical History + Follow-up Continuity

AyuSetu is NOT:

A diagnostic tool

A replacement for doctors

An online pharmacy

An online prescription platform

Keep this distinction throughout the entire UI and application logic.

24. DEMO DATA

Create realistic sample data so the application looks functional immediately.

Include:

2–3 hospitals

4–6 doctors

3–5 patients

One patient with previous case history

One follow-up case

One emergency case

Make the demo data easy to replace later.

25. IMPORTANT DEVELOPMENT REQUIREMENT

Do NOT create everything as one giant page.

Create reusable components and separate routes/pages for:

/
/patient/login
/patient/dashboard
/patient/profile
/patient/case/new
/patient/case/summary
/patient/follow-up
/patient/history
/patient/family

/doctor/login
/doctor/dashboard
/doctor/cases
/doctor/case/:id

/management/login
/management/dashboard

/emergency

Use clean reusable components and maintainable code.

Make all navigation buttons functional.

Start by building the landing page, role selection, authentication screens, patient dashboard, and basic routing. Then progressively implement the case-taking, doctor, follow-up, and management features.

The final product should feel like a polished, credible healthcare startup application suitable for an SIH hackathon demonstration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/19e044fe-402a-45a4-a2ad-082e93e6787c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
