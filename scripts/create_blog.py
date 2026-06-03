#!/usr/bin/env python3
"""Create and optionally publish an original education-news blog post.

The script intentionally uses public RSS/search feeds and short snippets only.
It does not copy full articles. Each generated post includes references back to
the original sources plus a credited free image.

Usage:
  python scripts/create_blog.py
  python scripts/create_blog.py --publish
  python scripts/create_blog.py --topic "IELTS preparation in Pakistan"
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import email.utils
import html
import json
import os
import re
import subprocess
import sys
import textwrap
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "frontend" / "public" / "blogs"
BLOG_IMAGE_DIR = BLOG_DIR / "images"
BLOG_INDEX = BLOG_DIR / "index.json"
SITEMAP = ROOT / "frontend" / "public" / "sitemap.xml"
SITE_URL = "https://www.aplusacademy.pk"

BLOG_CATEGORIES = [
    {
        "label": "K-12",
        "queries": [
            "global K-12 education students schools learning trends",
            "primary secondary education curriculum students worldwide",
            "school learning recovery assessment education international",
        ],
    },
    {
        "label": "O & A Level",
        "queries": [
            "Cambridge O Level A Level education exams students international",
            "Cambridge International education A Level O Level exams",
            "IGCSE O Level A Level students schools global education",
        ],
    },
    {
        "label": "Bachelors / Masters",
        "queries": [
            "higher education university students bachelors masters global trends",
            "university admissions graduate education international students",
            "college students skills employment higher education worldwide",
        ],
    },
    {
        "label": "Competitive Exams",
        "queries": [
            "competitive exams students test preparation education global",
            "standardized tests admissions exams students international",
            "exam preparation students assessment education news worldwide",
        ],
    },
    {
        "label": "IT & Technology",
        "queries": [
            "education technology IT skills students global learning",
            "digital skills computer science education students worldwide",
            "AI technology education students teachers global",
        ],
    },
    {
        "label": "Programming",
        "queries": [
            "programming education coding students global computer science",
            "coding skills students schools universities programming learning",
            "software development education students programming courses worldwide",
        ],
    },
    {
        "label": "Qur'an & Tajweed",
        "queries": [
            "Quran education Tajweed online learning students global",
            "Islamic education Quran learning children online classes",
            "Quran Tajweed teaching students education worldwide",
        ],
    },
    {
        "label": "English Language",
        "queries": [
            "English language learning students global education",
            "spoken English learning students education worldwide",
            "English grammar writing language learning international students",
        ],
    },
    {
        "label": "IELTS",
        "queries": [
            "IELTS students study abroad English test global education",
            "IELTS preparation international students study abroad news",
            "English proficiency tests IELTS education migration students",
        ],
    },
    {
        "label": "Graphics & Multimedia",
        "queries": [
            "graphic design education students multimedia skills global",
            "digital media design courses students creative skills education",
            "multimedia design learning students creative technology worldwide",
        ],
    },
]

NEWS_QUERIES = [query for category in BLOG_CATEGORIES for query in category["queries"][:1]]

STOPWORDS = {
    "about",
    "after",
    "again",
    "against",
    "also",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "have",
    "how",
    "in",
    "into",
    "is",
    "it",
    "new",
    "news",
    "of",
    "on",
    "or",
    "pakistan",
    "says",
    "school",
    "schools",
    "students",
    "that",
    "the",
    "their",
    "this",
    "to",
    "with",
}

IMAGE_POOL = [
    {
        "keywords": ["ai", "technology", "online", "digital", "computer"],
        "url": "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "sourceUrl": "https://www.pexels.com/photo/person-using-macbook-pro-1181354/",
        "credit": "Pexels free photo",
        "alt": "Student using a laptop for online learning",
    },
    {
        "keywords": ["ielts", "abroad", "english", "language"],
        "url": "https://images.pexels.com/photos/5940831/pexels-photo-5940831.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "sourceUrl": "https://www.pexels.com/photo/person-writing-on-white-paper-5940831/",
        "credit": "Pexels free photo",
        "alt": "Student writing study notes",
    },
    {
        "keywords": ["university", "higher", "college", "admission"],
        "url": "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "sourceUrl": "https://www.pexels.com/photo/people-walking-in-a-campus-267885/",
        "credit": "Pexels free photo",
        "alt": "Students walking on a university campus",
    },
    {
        "keywords": ["exam", "exams", "assessment", "cambridge", "level"],
        "url": "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "sourceUrl": "https://www.pexels.com/photo/books-on-library-shelf-256417/",
        "credit": "Pexels free photo",
        "alt": "Books in a library for exam preparation",
    },
    {
        "keywords": ["teacher", "class", "curriculum", "children"],
        "url": "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "sourceUrl": "https://www.pexels.com/photo/a-child-studying-with-a-tutor-5212345/",
        "credit": "Pexels free photo",
        "alt": "Child studying with tutor support",
    },
]

CATEGORY_IMAGES = {
    "K-12": [
        {
            "url": "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/a-child-studying-with-a-tutor-5212345/",
            "credit": "Pexels free photo",
            "alt": "Child studying with a tutor at a desk",
        },
        {
            "url": "https://images.pexels.com/photos/8422200/pexels-photo-8422200.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/children-in-a-classroom-8422200/",
            "credit": "Pexels free photo",
            "alt": "Children learning together in a classroom",
        },
        {
            "url": "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/teacher-and-students-in-classroom-8613089/",
            "credit": "Pexels free photo",
            "alt": "Teacher guiding students during a school lesson",
        },
        {
            "url": "https://images.pexels.com/photos/5427671/pexels-photo-5427671.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/kids-sitting-at-the-table-5427671/",
            "credit": "Pexels free photo",
            "alt": "Young learners working on classroom activities",
        },
    ],
    "O & A Level": [
        {
            "url": "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/books-on-library-shelf-256417/",
            "credit": "Pexels free photo",
            "alt": "Books in a library for Cambridge exam preparation",
        },
        {
            "url": "https://images.pexels.com/photos/4778621/pexels-photo-4778621.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/students-studying-together-4778621/",
            "credit": "Pexels free photo",
            "alt": "Students studying together for exams",
        },
        {
            "url": "https://images.pexels.com/photos/5905902/pexels-photo-5905902.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-writing-on-notebook-5905902/",
            "credit": "Pexels free photo",
            "alt": "Student writing exam revision notes",
        },
        {
            "url": "https://images.pexels.com/photos/5427659/pexels-photo-5427659.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/students-in-classroom-5427659/",
            "credit": "Pexels free photo",
            "alt": "Students focused during a classroom lesson",
        },
    ],
    "Bachelors / Masters": [
        {
            "url": "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/people-walking-in-a-campus-267885/",
            "credit": "Pexels free photo",
            "alt": "Students walking on a university campus",
        },
        {
            "url": "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/books-bookstore-book-reading-159711/",
            "credit": "Pexels free photo",
            "alt": "University books arranged for study",
        },
        {
            "url": "https://images.pexels.com/photos/8197543/pexels-photo-8197543.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/group-of-students-studying-8197543/",
            "credit": "Pexels free photo",
            "alt": "University students collaborating on coursework",
        },
        {
            "url": "https://images.pexels.com/photos/6146978/pexels-photo-6146978.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/students-using-laptop-6146978/",
            "credit": "Pexels free photo",
            "alt": "University students using a laptop for research",
        },
    ],
    "English Language": [
        {
            "url": "https://images.pexels.com/photos/8423402/pexels-photo-8423402.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/students-on-a-classroom-8423402/",
            "credit": "Pexels free photo by Pavel Danilyuk",
            "alt": "Students practising English in a classroom discussion",
        },
        {
            "url": "https://images.pexels.com/photos/5212331/pexels-photo-5212331.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/students-sitting-in-their-classroom-5212331/",
            "credit": "Pexels free photo by Max Fischer",
            "alt": "Students learning with a teacher in a bright classroom",
        },
        {
            "url": "https://images.pexels.com/photos/8617741/pexels-photo-8617741.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/students-and-teaching-inside-a-classroom-8617741/",
            "credit": "Pexels free photo by Yan Krukau",
            "alt": "Teacher guiding students through a language lesson",
        },
        {
            "url": "https://images.pexels.com/photos/5676741/pexels-photo-5676741.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/students-in-the-classroom-5676741/",
            "credit": "Pexels free photo",
            "alt": "University students collaborating during class",
        },
    ],
    "IELTS": [
        {
            "url": "https://images.pexels.com/photos/5940831/pexels-photo-5940831.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-writing-on-white-paper-5940831/",
            "credit": "Pexels free photo",
            "alt": "Student writing IELTS preparation notes",
        },
        {
            "url": "https://images.pexels.com/photos/3768126/pexels-photo-3768126.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-holding-a-pencil-3768126/",
            "credit": "Pexels free photo",
            "alt": "Learner preparing written answers for an English test",
        },
        {
            "url": "https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-writing-on-notebook-4145153/",
            "credit": "Pexels free photo",
            "alt": "English language notebook for test preparation",
        },
        {
            "url": "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-writing-on-a-notebook-4145190/",
            "credit": "Pexels free photo",
            "alt": "Student practising English writing skills",
        },
    ],
    "IT & Technology": [
        {
            "url": "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-using-macbook-pro-1181354/",
            "credit": "Pexels free photo",
            "alt": "Student using a laptop for technology learning",
        },
        {
            "url": "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-holding-pen-near-laptop-computer-3861969/",
            "credit": "Pexels free photo",
            "alt": "Technology learner working beside a laptop",
        },
        {
            "url": "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-using-laptop-computer-3861958/",
            "credit": "Pexels free photo",
            "alt": "Laptop workspace for digital skills learning",
        },
        {
            "url": "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/people-sitting-down-near-table-with-assorted-laptop-computers-3184465/",
            "credit": "Pexels free photo",
            "alt": "Students collaborating with laptops in a training session",
        },
    ],
    "Programming": [
        {
            "url": "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/turned-on-monitor-screen-1181675/",
            "credit": "Pexels free photo",
            "alt": "Programming code displayed on a computer screen",
        },
        {
            "url": "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/close-up-photo-of-programming-of-codes-546819/",
            "credit": "Pexels free photo",
            "alt": "Close-up of programming code for software learning",
        },
        {
            "url": "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-using-macbook-pro-574071/",
            "credit": "Pexels free photo",
            "alt": "Developer working on a laptop for coding practice",
        },
        {
            "url": "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/coding-script-270348/",
            "credit": "Pexels free photo",
            "alt": "Code editor for programming lessons",
        },
    ],
    "Graphics & Multimedia": [
        {
            "url": "https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-using-computer-196645/",
            "credit": "Pexels free photo",
            "alt": "Designer working on a laptop for multimedia projects",
        },
        {
            "url": "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-drawing-on-paper-4348404/",
            "credit": "Pexels free photo",
            "alt": "Creative design sketching for multimedia learning",
        },
        {
            "url": "https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/woman-editing-photos-on-a-computer-6476587/",
            "credit": "Pexels free photo",
            "alt": "Designer editing visual media on a computer",
        },
        {
            "url": "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-working-on-creative-design-5926382/",
            "credit": "Pexels free photo",
            "alt": "Creative workspace for graphic design learning",
        },
    ],
    "Qur'an & Tajweed": [
        {
            "url": "https://images.pexels.com/photos/8164397/pexels-photo-8164397.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/a-quran-book-on-the-stand-8164397/",
            "credit": "Pexels free photo",
            "alt": "Quran placed on a wooden stand for recitation practice",
        },
        {
            "url": "https://images.pexels.com/photos/7249288/pexels-photo-7249288.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-pointing-to-an-open-book-7249288/",
            "credit": "Pexels free photo",
            "alt": "Teacher pointing to Quran text during a learning session",
        },
        {
            "url": "https://images.pexels.com/photos/8522578/pexels-photo-8522578.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/close-up-shot-of-a-book-8522578/",
            "credit": "Pexels free photo",
            "alt": "Open Quran pages for tajweed and hifz revision",
        },
        {
            "url": "https://images.pexels.com/photos/15694717/pexels-photo-15694717.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/quran-book-on-windowsill-15694717/",
            "credit": "Pexels free photo",
            "alt": "Quran book near a window for daily recitation",
        },
    ],
    "Competitive Exams": [
        {
            "url": "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/books-on-library-shelf-256417/",
            "credit": "Pexels free photo",
            "alt": "Library books for competitive exam preparation",
        },
        {
            "url": "https://images.pexels.com/photos/5940831/pexels-photo-5940831.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/person-writing-on-white-paper-5940831/",
            "credit": "Pexels free photo",
            "alt": "Student writing a timed exam practice answer",
        },
        {
            "url": "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/a-child-studying-with-a-tutor-5212345/",
            "credit": "Pexels free photo",
            "alt": "Tutor helping a student prepare for exams",
        },
        {
            "url": "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1600",
            "sourceUrl": "https://www.pexels.com/photo/people-walking-in-a-campus-267885/",
            "credit": "Pexels free photo",
            "alt": "University campus linked to admissions testing",
        },
    ],
}

ARTICLE_IMAGE_SLOTS = [
    "hero",
    "student impact",
    "parent action plan",
    "tutor guidance",
]

CATEGORY_GUIDANCE = {
    "K-12": {
        "focus": "school routines, concept clarity, assessments, homework support, and age-appropriate online learning",
        "actions": [
            "Check the child's current syllabus and mark the three weakest chapters before booking extra support.",
            "Build a weekly plan with one concept session, one written practice session, and one short review conversation.",
            "Ask the tutor to share visible progress: quiz scores, corrected mistakes, and next-week goals.",
        ],
    },
    "O & A Level": {
        "focus": "Cambridge syllabus coverage, past papers, subject choices, predicted grades, and exam-board updates",
        "actions": [
            "Match every lesson to the current Cambridge syllabus and keep a topic-by-topic checklist.",
            "Practise past-paper questions under timed conditions, then review the mark scheme rather than only the answer.",
            "Confirm registration deadlines, component codes, and predicted-grade requirements with the school.",
        ],
    },
    "Bachelors / Masters": {
        "focus": "university admissions, degree planning, research skills, employability, and postgraduate readiness",
        "actions": [
            "Shortlist programmes by entry requirements, fee deadlines, scholarship dates, and career outcomes.",
            "Strengthen academic writing, presentation, and research methods before final-year pressure arrives.",
            "Use tutoring or mentoring for difficult courses instead of waiting until the final exam week.",
        ],
    },
    "Competitive Exams": {
        "focus": "syllabus tracking, past papers, admissions tests, time management, and official notices",
        "actions": [
            "Download the latest official syllabus and convert it into a weekly preparation tracker.",
            "Do one timed practice set every week and record mistakes by topic, not just by score.",
            "Verify dates, centres, roll-number slips, and result notices from official boards or testing bodies.",
        ],
    },
    "IT & Technology": {
        "focus": "digital skills, certifications, AI literacy, freelancing readiness, and practical projects",
        "actions": [
            "Choose one job-relevant skill track and build a small portfolio project within two weeks.",
            "Compare certifications by employer value, course depth, project work, and local affordability.",
            "Practise explaining technical work in simple English because interviews and freelancing both require it.",
        ],
    },
    "Programming": {
        "focus": "coding fundamentals, software projects, debugging habits, computer science concepts, and portfolio building",
        "actions": [
            "Pick one language and complete small projects before jumping between frameworks.",
            "Keep a debugging journal that records the error, cause, fix, and lesson learned.",
            "Publish a simple portfolio project or GitHub repository to show real problem-solving ability.",
        ],
    },
    "Qur'an & Tajweed": {
        "focus": "tajweed rules, hifz planning, qari qualifications, online Quran classes, recitation practice, and family routines",
        "actions": [
            "Choose a qualified qari or qaria who can correct makharij, tajweed rules, fluency, and revision habits.",
            "Set a realistic hifz or nazra routine with daily recitation, weekly revision, and parent listening time.",
            "Evaluate online Quran platforms by teacher screening, trial class quality, class timing, and progress reports.",
        ],
    },
    "English Language": {
        "focus": "spoken English, grammar, vocabulary, writing confidence, pronunciation, and practical communication",
        "actions": [
            "Balance grammar study with daily speaking practice so confidence grows with accuracy.",
            "Keep a vocabulary notebook with example sentences instead of isolated word lists.",
            "Ask the tutor to correct pronunciation, sentence structure, and writing in the same weekly cycle.",
        ],
    },
    "IELTS": {
        "focus": "band-score targets, writing task 2, speaking practice, listening and reading strategy, and test timelines",
        "actions": [
            "Take a diagnostic test and set separate band targets for listening, reading, writing, and speaking.",
            "Practise IELTS Writing Task 2 with feedback on task response, coherence, vocabulary, and grammar.",
            "Choose a test date only after mock results are close to the required band score.",
        ],
    },
    "Graphics & Multimedia": {
        "focus": "design fundamentals, creative software, portfolio work, branding, video, animation, and freelancing readiness",
        "actions": [
            "Learn design principles alongside software tools so the portfolio looks intentional, not template-based.",
            "Create three portfolio pieces: one social campaign, one brand layout, and one motion or multimedia sample.",
            "Collect feedback on readability, spacing, colour, and client goals before publishing work online.",
        ],
    },
}

CATEGORY_OUTCOMES = {
    "K-12": "a corrected worksheet, a clearer concept explanation, or a stronger quiz result",
    "O & A Level": "a marked past-paper answer, a completed syllabus checklist, or a better timed response",
    "Bachelors / Masters": "a stronger assignment draft, a clearer research outline, or a completed admissions task",
    "Competitive Exams": "a timed practice score, a corrected weak topic, or a verified exam deadline",
    "IT & Technology": "a working project, a completed certification module, or a clearer technical explanation",
    "Programming": "a running program, a fixed bug, or a small project pushed to a portfolio",
    "Qur'an & Tajweed": "a corrected recitation, stronger makharij, or a consistent hifz revision record",
    "English Language": "a clearer spoken response, a corrected paragraph, or a stronger vocabulary routine",
    "IELTS": "a marked Task 2 essay, a recorded speaking answer, or a timed listening and reading score",
    "Graphics & Multimedia": "a cleaner layout, a stronger portfolio piece, or a revised design based on feedback",
}

INTERNAL_LINKS = {
    "English Language": [
        {"label": "English Language classes", "url": "/english-language"},
        {"label": "IELTS preparation", "url": "/ielts"},
        {"label": "Online tutors in Pakistan", "url": "/online-tutors-pakistan"},
        {"label": "Find an English tutor", "url": "/teachers"},
    ],
    "Competitive Exams": [
        {"label": "Competitive exam preparation", "url": "/competitive-exams"},
        {"label": "Online tutors in Pakistan", "url": "/online-tutors-pakistan"},
        {"label": "O & A Level support", "url": "/o-a-level"},
        {"label": "Find a tutor", "url": "/teachers"},
    ],
    "Qur'an & Tajweed": [
        {"label": "Qur'an & Tajweed classes", "url": "/quran-tajweed"},
        {"label": "Online tutors in Pakistan", "url": "/online-tutors-pakistan"},
        {"label": "Find a Quran tutor", "url": "/teachers"},
        {"label": "Become a tutor", "url": "/register"},
    ],
}

EDITORIAL_TOPICS = {
    "K-12": "K-12 Education: Curriculum and Classroom Learning",
    "O & A Level": "O and A Level Exam Preparation Updates",
    "Bachelors / Masters": "Higher Education: Admissions and Student Support",
    "Competitive Exams": "Competitive Exams and Assessment Updates",
    "IT & Technology": "Technology Education and Digital Skills",
    "Programming": "Programming Education and Coding Skills",
    "Qur'an & Tajweed": "Quran Memorization and Tajweed Education",
    "English Language": "English Language Learning and Communication",
    "IELTS": "IELTS and English Proficiency Testing",
    "Graphics & Multimedia": "Design and Multimedia Education",
}

CATEGORY_KEYWORDS = {
    "K-12": ["k-12", "school", "primary", "secondary", "children", "curriculum", "assessment", "classroom", "teacher"],
    "O & A Level": ["cambridge", "o level", "a level", "igcse", "exam", "syllabus", "cie", "pearson", "edexcel"],
    "Bachelors / Masters": ["university", "college", "bachelor", "master", "graduate", "degree", "admission", "higher education"],
    "Competitive Exams": ["exam", "test", "assessment", "admission", "competitive", "standardized", "board", "result", "entry test"],
    "IT & Technology": ["technology", "digital", "ai", "computer", "cyber", "data", "cloud", "edtech", "skills"],
    "Programming": ["programming", "coding", "software", "developer", "computer science", "python", "javascript", "code"],
    "Qur'an & Tajweed": ["quran", "qur'an", "tajweed", "hifz", "hafiz", "recitation", "qari", "islamic education", "memorization", "memorisation", "online quran"],
    "English Language": ["english", "language", "grammar", "spoken", "writing", "vocabulary", "pronunciation", "communication"],
    "IELTS": ["ielts", "english proficiency", "study abroad", "band score", "speaking test", "writing task", "idp", "british council"],
    "Graphics & Multimedia": ["graphic", "design", "multimedia", "creative", "animation", "video", "photoshop", "illustrator", "portfolio"],
}

GLOBAL_BLOCKLIST_TERMS = [
    "taliban",
    "terror",
    "terrorism",
    "suspect",
    "attack",
    "extremist",
    "militant",
    "war crime",
    "shooting",
    "bomb",
]

AGGREGATOR_SNIPPETS = [
    "comprehensive, up-to-date news coverage",
    "coverage, aggregated from sources all over the world",
    "google news",
]

MAX_SOURCE_AGE_DAYS = 180
RECENT_IMAGE_LOOKBACK = 60


def slugify(value: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9\s-]", "", value).strip().lower()
    value = re.sub(r"[\s-]+", "-", value)
    return value[:80].strip("-") or "education-update"


def clean_text(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value or "")
    value = html.unescape(value)
    replacements = {
        "â€™": "'",
        "â€œ": '"',
        "â€": '"',
        "â€“": "-",
        "â€”": "-",
        "â€˜": "'",
    }
    for bad, good in replacements.items():
        value = value.replace(bad, good)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def trim_text(value: str, limit: int = 155) -> str:
    if len(value) <= limit:
        return value
    trimmed = value[:limit].rsplit(" ", 1)[0].rstrip(" ,.;:")
    return f"{trimmed}."


def split_sentences(value: str) -> list[str]:
    cleaned = clean_text(value)
    if not cleaned:
        return []
    sentences = re.split(r"(?<=[.!?])\s+", cleaned)
    return [sentence.strip() for sentence in sentences if len(sentence.split()) >= 6]


def strip_source_from_title(title: str, source: str) -> str:
    cleaned = clean_text(title).rstrip(".")
    if source:
        cleaned = re.sub(rf"\s+-\s+{re.escape(source)}$", "", cleaned, flags=re.I)
    return cleaned


def category_focus(category_label: str | None) -> str:
    if not category_label:
        return "learning plans, tutor support, exam preparation, and student progress"
    return CATEGORY_GUIDANCE.get(category_label, {}).get(
        "focus",
        "learning plans, tutor support, exam preparation, and student progress",
    )


def editorial_category_phrase(category_label: str | None) -> str:
    return {
        "K-12": "school learning and assessment",
        "O & A Level": "Cambridge exam preparation",
        "Bachelors / Masters": "higher education support",
        "Competitive Exams": "competitive exam preparation and admissions testing",
        "IT & Technology": "technology education",
        "Programming": "programming education",
        "Qur'an & Tajweed": "Quran memorization and Tajweed education",
        "English Language": "English language learning",
        "IELTS": "English proficiency testing",
        "Graphics & Multimedia": "design and multimedia education",
    }.get(category_label or "", "education and learning")


def category_actions(category_label: str | None) -> list[str]:
    if not category_label:
        return [
            "Check the official source behind the update before changing a study plan.",
            "Turn the news into one weekly academic target instead of reacting with stress.",
            "Ask a tutor to diagnose weak areas before adding more lessons.",
        ]
    return CATEGORY_GUIDANCE.get(category_label, {}).get("actions", [])


def category_outcome(category_label: str | None) -> str:
    return CATEGORY_OUTCOMES.get(
        category_label or "",
        "a visible learning result, a corrected mistake, or a verified next step",
    )


def internal_links_for(category_label: str | None) -> list[dict]:
    return INTERNAL_LINKS.get(
        category_label or "",
        [
            {"label": "Find a tutor", "url": "/teachers"},
            {"label": "Online tutors in Pakistan", "url": "/online-tutors-pakistan"},
            {"label": "Study abroad support", "url": "/study-abroad"},
        ],
    )


def parse_feed_date(value: str) -> dt.datetime | None:
    if not value:
        return None
    try:
        parsed = email.utils.parsedate_to_datetime(value)
    except (TypeError, ValueError):
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt.timezone.utc)
    return parsed.astimezone(dt.timezone.utc)


def is_recent_source(item: dict, max_age_days: int = MAX_SOURCE_AGE_DAYS) -> bool:
    published = parse_feed_date(item.get("publishedAt", ""))
    if published is None:
        return True
    cutoff = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=max_age_days)
    return published >= cutoff


def fetch_url(url: str, timeout: int = 20) -> bytes:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "APlusAcademyBlogBot/1.0 (+https://www.aplusacademy.pk)",
            "Accept": "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        },
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def decode_html(raw: bytes) -> str:
    for encoding in ("utf-8", "cp1252", "latin-1"):
        try:
            return raw.decode(encoding)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")


def extract_meta(html_text: str, key: str) -> str:
    patterns = [
        rf'<meta[^>]+property=["\']{re.escape(key)}["\'][^>]+content=["\']([^"\']+)["\']',
        rf'<meta[^>]+name=["\']{re.escape(key)}["\'][^>]+content=["\']([^"\']+)["\']',
        rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']{re.escape(key)}["\']',
    ]
    for pattern in patterns:
        match = re.search(pattern, html_text, flags=re.I)
        if match:
            return clean_text(match.group(1))
    return ""


def extract_article_context(item: dict) -> str:
    try:
        raw = fetch_url(item["url"], timeout=12)
    except Exception:
        return item.get("summary", "")

    html_text = decode_html(raw)
    parts = [
        extract_meta(html_text, "description"),
        extract_meta(html_text, "og:description"),
    ]
    paragraphs = re.findall(r"<p[^>]*>(.*?)</p>", html_text, flags=re.I | re.S)
    for paragraph in paragraphs[:8]:
        cleaned = clean_text(paragraph)
        if len(cleaned.split()) >= 12:
            parts.append(cleaned)

    context = " ".join(part for part in parts if part)
    context = trim_text(context, 900)
    if any(snippet in context.lower() for snippet in AGGREGATOR_SNIPPETS):
        return item.get("summary", "")
    return context or item.get("summary", "")


def google_news_rss(query: str) -> str:
    if "when:" not in query:
        query = f"{query} when:{MAX_SOURCE_AGE_DAYS}d"
    encoded = urllib.parse.quote(query)
    return f"https://news.google.com/rss/search?q={encoded}&hl=en-US&gl=US&ceid=US:en"


def parse_feed(xml_bytes: bytes) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    channel = root.find("channel")
    if channel is None:
        return []

    items = []
    for item in channel.findall("item"):
        title = clean_text(item.findtext("title"))
        link = clean_text(item.findtext("link"))
        description = clean_text(item.findtext("description"))
        published = clean_text(item.findtext("pubDate"))
        source_el = item.find("source")
        source = clean_text(source_el.text if source_el is not None else "")
        source_url = source_el.attrib.get("url", "") if source_el is not None else ""

        if not title or not link:
            continue

        items.append(
            {
                "title": title,
                "url": link,
                "sourceHomepage": source_url,
                "feedUrl": link,
                "summary": description,
                "publishedAt": published,
                "source": source or urllib.parse.urlparse(source_url or link).netloc,
            }
        )
    return items


def relevance_score(item: dict, category: dict | None) -> int:
    if not category:
        return 1

    if not is_recent_source(item):
        return -90

    category_label = category["label"]
    text = " ".join(
        [
            item.get("title", ""),
            item.get("summary", ""),
            item.get("source", ""),
        ]
    ).lower()

    if any(term in text for term in GLOBAL_BLOCKLIST_TERMS):
        return -100

    keywords = CATEGORY_KEYWORDS.get(category_label, [])
    score = 0
    for keyword in keywords:
        if keyword in text:
            score += 3 if " " in keyword else 2

    if "education" in text or "learning" in text or "students" in text:
        score += 1
    if category_label == "Qur'an & Tajweed" and "madrasa" in text and score < 3:
        score -= 4
    if item.get("source", "").lower() in {"google news"}:
        score -= 1
    return score


def select_relevant_items(items: list[dict], category: dict | None, max_items: int) -> list[dict]:
    if not category:
        return items[:max_items]

    scored = sorted(
        ((relevance_score(item, category), index, item) for index, item in enumerate(items)),
        key=lambda row: (row[0], -row[1]),
        reverse=True,
    )
    minimum_score = 2
    filtered = [item for score, _, item in scored if score >= minimum_score]
    if len(filtered) < 3:
        filtered = [item for score, _, item in scored if score > -50 and is_recent_source(item)]
    if len(filtered) < 3:
        filtered = [item for score, _, item in scored if score > -50]

    distinct_sources = []
    selected = []
    for item in filtered:
        source_key = item["source"].lower()
        if source_key not in distinct_sources:
            distinct_sources.append(source_key)
            selected.append(item)
        if len(selected) >= max_items:
            return selected

    return (selected + filtered)[:max_items]


def gather_news(topic: str | None, max_items: int, category: dict | None = None) -> list[dict]:
    if topic:
        queries = [topic]
    elif category:
        queries = category["queries"]
    else:
        queries = NEWS_QUERIES
    seen = set()
    items: list[dict] = []

    for query in queries:
        try:
            feed_items = parse_feed(fetch_url(google_news_rss(query)))
        except Exception as exc:
            print(f"Warning: could not fetch news for {query!r}: {exc}", file=sys.stderr)
            continue

        for item in feed_items:
            key = (item["title"].lower(), item["source"].lower())
            if key in seen:
                continue
            seen.add(key)
            items.append(item)
        time.sleep(1)

    return select_relevant_items(items, category, max_items)


def choose_topic(items: list[dict], forced_topic: str | None, category_label: str | None = None) -> str:
    if forced_topic:
        return forced_topic.strip()

    if category_label:
        return EDITORIAL_TOPICS.get(category_label, f"{category_label} Education Updates")

    haystack = " ".join(item["title"] for item in items[:10]).lower()
    topic_rules = [
        (["exam", "exams", "matric", "ssc", "board", "assessment"], "Board Exams And School Assessment"),
        (["ai", "artificial intelligence", "technology", "digital", "online"], "AI And Digital Learning"),
        (["ielts", "study abroad", "visa", "international"], "IELTS And Study Abroad Preparation"),
        (["university", "higher education", "college", "admission"], "Higher Education And Admissions"),
        (["teacher", "teachers", "curriculum", "classroom"], "Teaching And Classroom Learning"),
    ]
    for keywords, label in topic_rules:
        if any(keyword in haystack for keyword in keywords):
            return label

    words: list[str] = []
    for item in items[:10]:
        words.extend(re.findall(r"[a-zA-Z]{4,}", item["title"].lower()))

    common = [word for word, _ in Counter(words).most_common(8) if word not in STOPWORDS]
    if "education" not in common:
        common.insert(0, "education")

    phrase = " ".join(common[:4]).title()
    return phrase or "Pakistan Education Update"


def image_key(url: str) -> str:
    parsed = urllib.parse.urlparse(url or "")
    return parsed._replace(query="", fragment="").geturl()


def recently_used_image_urls(current_slug: str | None = None) -> set[str]:
    if not BLOG_INDEX.exists():
        return set()
    try:
        index = json.loads(BLOG_INDEX.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return set()

    used: set[str] = set()
    for item in index[:RECENT_IMAGE_LOOKBACK]:
        if item.get("slug") == current_slug:
            continue
        hero_url = (item.get("heroImage") or {}).get("url", "")
        if hero_url:
            used.add(image_key(hero_url))
    return used


def with_image_metadata(images: list[dict]) -> list[dict]:
    return [
        {
            **image,
            "kind": "pexels",
            "placement": ARTICLE_IMAGE_SLOTS[index],
        }
        for index, image in enumerate(images[:4])
    ]


def select_unique_image_set(candidate_sets: list[list[dict]], used_urls: set[str]) -> list[dict]:
    first_non_empty = next((images for images in candidate_sets if images), [])
    for images in candidate_sets:
        if images and image_key(images[0].get("url", "")) not in used_urls:
            return images
    return first_non_empty


def choose_images(
    topic: str,
    items: list[dict],
    slug: str,
    image_mode: str,
    category_label: str | None = None,
) -> list[dict]:
    if image_mode in {"auto", "ai"} and os.environ.get("OPENAI_API_KEY"):
        try:
            return generate_ai_images(topic, items, slug)
        except Exception as exc:
            if image_mode == "ai":
                raise
            print(f"Warning: AI image generation failed, using Pexels fallback: {exc}", file=sys.stderr)

    used_urls = recently_used_image_urls(slug)
    candidate_sets: list[list[dict]] = []
    if category_label in CATEGORY_IMAGES:
        category_images = CATEGORY_IMAGES[category_label]
        candidate_sets.extend(category_images[offset:] + category_images[:offset] for offset in range(len(category_images)))

    haystack = " ".join([topic] + [item["title"] for item in items]).lower()
    ranked = []
    for image in IMAGE_POOL:
        score = sum(1 for keyword in image["keywords"] if keyword in haystack)
        ranked.append((score, image))
    ranked.sort(key=lambda item: item[0], reverse=True)
    fallback_images = [image for _, image in ranked]
    candidate_sets.extend(fallback_images[offset:] + fallback_images[:offset] for offset in range(len(fallback_images)))
    selected = select_unique_image_set(candidate_sets, used_urls)
    if not selected:
        raise RuntimeError("No image candidates are configured for blog generation.")
    return with_image_metadata(selected)


def generate_ai_images(topic: str, items: list[dict], slug: str) -> list[dict]:
    BLOG_IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    api_key = os.environ["OPENAI_API_KEY"]
    model = os.environ.get("OPENAI_IMAGE_MODEL", "gpt-image-1-mini")
    titles = "; ".join(item["title"] for item in items[:3])
    images = []

    for index, slot in enumerate(ARTICLE_IMAGE_SLOTS):
        prompt = (
            "Create a realistic editorial image for A Plus Academy Pakistan. "
            f"Topic: {topic}. Article context: {titles}. "
            f"Image role: {slot}. Show Pakistani students, parents, tutors, desks, notebooks, "
            "classrooms, laptops, or exam preparation as relevant. No logos, no readable text, "
            "no political symbols, natural lighting, professional education blog style."
        )
        payload = {
            "model": model,
            "prompt": prompt,
            "size": "1536x1024",
            "quality": "low",
            "n": 1,
        }
        request = urllib.request.Request(
            "https://api.openai.com/v1/images/generations",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=90) as response:
            data = json.loads(response.read().decode("utf-8"))

        image_data = data["data"][0]
        if image_data.get("b64_json"):
            raw = base64.b64decode(image_data["b64_json"])
        elif image_data.get("url"):
            raw = fetch_url(image_data["url"], timeout=60)
        else:
            raise RuntimeError("OpenAI image response did not include image data.")

        filename = f"{slug}-{index + 1}.png"
        output = BLOG_IMAGE_DIR / filename
        output.write_bytes(raw)
        images.append(
            {
                "kind": "ai",
                "placement": slot,
                "url": f"/blogs/images/{filename}",
                "sourceUrl": "https://platform.openai.com/docs/guides/image-generation",
                "credit": f"AI-generated image by A Plus Academy using {model}",
                "alt": f"{topic} education blog illustration for {slot}",
                "prompt": prompt,
            }
        )

    return images


def summarize_source(item: dict, category_label: str | None) -> str:
    source = item["source"] or "the referenced source"
    title = strip_source_from_title(item["title"], source)
    context = clean_text(item.get("articleContext") or item.get("summary") or "")
    title_key = re.sub(r"[^a-z0-9]+", " ", title.lower()).strip()
    title_tokens = set(title_key.split())
    sentences = []
    for sentence in split_sentences(context):
        sentence_key = re.sub(r"[^a-z0-9]+", " ", sentence.lower()).strip()
        sentence_tokens = set(sentence_key.split())
        token_overlap = len(title_tokens & sentence_tokens) / max(1, len(sentence_tokens))
        if title_key and (sentence_key == title_key or title_key in sentence_key):
            continue
        if token_overlap >= 0.75:
            continue
        if source and sentence.lower().strip() == source.lower().strip():
            continue
        sentences.append(sentence)
    if sentences:
        detail = " ".join(sentences[:2])
        return (
            f"{source} covered {title[0].lower() + title[1:] if title else 'a relevant education development'}. "
            f"{detail}"
        )

    return (
        f"{source} covered \"{title}.\" The development reflects ongoing changes in "
        f"{editorial_category_phrase(category_label)}."
    )


def infer_source_angle(item: dict, category_label: str | None) -> tuple[str, str, str]:
    title = strip_source_from_title(item["title"], item.get("source", ""))
    text = f"{title} {item.get('summary', '')}".lower()

    if category_label == "English Language":
        if any(term in text for term in ("english uk", "policy", "minister", "jacqui smith")):
            return (
                "The source is about policy confidence in the English-language education market, not only classroom grammar.",
                "Policy signals matter because international students choose countries and courses partly on visa clarity, trust, and perceived student support.",
                "It also shows how language education is tied to mobility, institutional trust, and student support systems.",
            )
        if any(term in text for term in ("esl", "celcis", "40 years", "excellence")):
            return (
                "The source points to long-running ESL support as a serious academic service, not a casual extra class.",
                "Strong language centres show that English progress needs placement, feedback, speaking practice, writing support, and trained instructors.",
                "The broader lesson is that language learning improves when institutions combine qualified instructors with consistent feedback.",
            )
        if any(term in text for term in ("proficiency", "requirement", "critic", "criticized", "criticised")):
            return (
                "The source raises the issue of language proficiency requirements and how students experience them.",
                "That matters because English rules can affect admission, graduation, scholarships, and confidence in higher education.",
                "It reflects a wider debate over how universities define readiness and how students prove communication ability.",
            )
        if any(term in text for term in ("online", "digital", "platform", "app", "ai")):
            return (
                "The source shows English learning moving further into digital tools and online delivery.",
                "Digital practice can help, but only when learners still receive correction on pronunciation, grammar, writing, and fluency.",
                "The wider trend is a blended model in which apps support repetition while teachers provide correction and structure.",
            )

    if category_label == "Competitive Exams":
        if any(term in text for term in ("standardized", "sat", "admission", "yale", "lsu", "uc")):
            return (
                "The source is about the return or debate around standardized testing in admissions.",
                "This matters globally because universities are still balancing fairness, academic prediction, and access.",
                "The debate shows that exam policy remains unsettled, especially where admissions teams weigh grades, tests, and wider student context.",
            )
        if any(term in text for term in ("board", "cbse", "exam", "results", "oxfordaqa")):
            return (
                "The source focuses on formal exam systems, results, or board-level assessment pressure.",
                "Exam timing and assessment design shape how students revise, practise, and manage stress.",
                "It highlights how assessment systems influence preparation habits, school calendars, and expectations around results.",
            )
        if any(term in text for term in ("app", "sathee", "digital", "online")):
            return (
                "The source highlights digital exam-preparation support.",
                "Free or low-cost platforms can widen access, but students still need a plan for weak topics and mock-test review.",
                "The key issue is whether digital tools help students move from access to measurable preparation gains.",
            )

    if category_label == "Qur'an & Tajweed":
        if any(term in text for term in ("hifz", "memorization", "memorisation", "memorization")):
            return (
                "The source is about hifz and Quran memorisation becoming more organised across families and communities.",
                "Hifz success depends on revision, listening, tajweed correction, and a sustainable daily routine.",
                "The development reflects a wider move toward structured routines and longer-term support for Quranic learning.",
            )
        if any(term in text for term in ("platform", "online", "digital")):
            return (
                "The source points to Quran education moving onto digital platforms.",
                "Online Quran learning can help with access and scheduling, but teacher quality and correction remain essential.",
                "The wider question is how digital access can be balanced with teacher quality, recitation correction, and continuity.",
            )
        if any(term in text for term in ("parent", "follow-up", "children", "kids")):
            return (
                "The source highlights family involvement in Quran learning.",
                "Parent follow-up matters because recitation and memorisation improve through daily listening and repetition.",
                "It underlines the continuing role of family routines alongside formal classes and community programmes.",
            )

    phrase = editorial_category_phrase(category_label)
    return (
        f"The source describes a current development in {phrase}.",
        "It shows how institutions, learners, or families are adjusting to changing expectations in this field.",
        "Alongside the other sources, it helps show how education delivery and learner demand are changing.",
    )


def source_analysis(item: dict, topic: str, index: int, category_label: str | None) -> dict:
    source = item["source"] or f"Source {index}"
    title = strip_source_from_title(item["title"], source)
    summary = summarize_source(item, category_label)
    story_context, wider_value, connecting_theme = infer_source_angle(item, category_label)
    body = (
        f"{summary} {story_context} {wider_value} {connecting_theme}"
    )

    return {
        "source": source,
        "title": title,
        "url": item["url"],
        "publishedAt": item.get("publishedAt", ""),
        "heading": source,
        "summary": body,
    }


def shared_guidance_section(topic: str, category_label: str | None) -> dict:
    focus = category_focus(category_label)
    return {
        "heading": "What this means for students, parents, and tutors",
        "body": (
            f"The shared message across these sources is that {topic} should be turned into a practical "
            f"learning plan, not treated as background noise. For this category, the important areas are {focus}. "
            "Students should identify the next skill or chapter that needs attention. Parents should ask whether "
            "the current routine is producing visible progress. Tutors should connect each lesson to a measurable "
            f"outcome: {category_outcome(category_label)}.\n\n"
            "For Pakistani families, the safest habit is to verify official dates and requirements, then act early. "
            "A short diagnostic session, a weekly written task, or a structured revision plan can prevent confusion "
            "from becoming exam pressure. A Plus Academy can support that work through subject tutors, online classes, "
            "exam preparation, language coaching, Quran learning, programming support, and skill-based mentoring."
        ),
    }


def action_steps_section(category_label: str | None) -> dict:
    actions = category_actions(category_label)
    body = "\n".join(f"{index + 1}. {action}" for index, action in enumerate(actions))
    return {
        "heading": f"Three action steps for {category_label or 'education'} learners in Pakistan",
        "body": body,
    }


def global_context_section(topic: str, selected_items: list[dict], category_label: str | None) -> dict:
    source_names = ", ".join(item.get("source", "a referenced source") for item in selected_items[:3])
    phrase = editorial_category_phrase(category_label)
    return {
        "heading": "Why this matters globally",
        "body": (
            f"The sources from {source_names} show how {phrase} is changing across different education systems. "
            "Institutions are paying more attention to measurable progress, flexible learning options, and the "
            "quality of student support. For readers, the important point is not that every country has the same "
            "system. The useful lesson is that learners who can prove their skills through writing, speaking, "
            "testing, recitation, coding, or portfolio work are better prepared when policies and requirements change."
        ),
    }


def emerging_themes_section(topic: str, selected_items: list[dict], category_label: str | None) -> dict:
    focus = category_focus(category_label)
    phrase = editorial_category_phrase(category_label)
    return {
        "heading": "Emerging themes",
        "body": (
            f"Several themes connect these developments. First, {phrase} is becoming more structured, with programmes "
            "and institutions placing greater emphasis on planned instruction rather than informal study alone. Second, "
            "families and learners continue to play an important role in maintaining progress outside the classroom, "
            "especially where revision, practice, or long-term skill development is required. Third, demand for qualified "
            f"instructors is rising because {focus} requires consistency, correction, and clear learning standards."
        ),
    }


def digital_learning_section(category_label: str | None) -> dict:
    if category_label == "Qur'an & Tajweed":
        body = (
            "Digital learning is becoming more visible in Quran education through online Tajweed classes, virtual hifz "
            "groups, revision reminders, recitation recordings, and Quran learning platforms. These tools can improve "
            "access and continuity, especially for learners who do not live near a suitable teacher. At the same time, "
            "the core requirement remains human correction: pronunciation, makharij, fluency, and memorisation quality "
            "still depend on trained instruction."
        )
    elif category_label == "English Language":
        body = (
            "Digital learning is also reshaping English education. Language apps, online classes, speech-practice tools, "
            "AI writing feedback, and remote tutoring can increase daily exposure to English. The most effective models "
            "combine digital repetition with teacher-led correction, because fluency, pronunciation, essay structure, "
            "and academic vocabulary require feedback as well as practice."
        )
    elif category_label == "Competitive Exams":
        body = (
            "Digital exam preparation is expanding through practice platforms, recorded lessons, mock-test systems, and "
            "adaptive quizzes. These tools can make preparation more accessible, but their value depends on how well they "
            "help learners identify weak topics, review mistakes, and improve performance over time."
        )
    else:
        body = (
            "Digital learning appears across the sources as a supporting trend rather than a complete replacement for "
            "instruction. Online platforms can widen access, organise practice, and provide flexible learning options, "
            "but educational quality still depends on curriculum design, feedback, and sustained engagement."
        )
    return {"heading": "The role of digital learning", "body": body}


def conclusion_section(topic: str, selected_items: list[dict], category_label: str | None) -> dict:
    regions = []
    for item in selected_items:
        text = f"{item.get('title', '')} {item.get('summary', '')}".lower()
        for region in ("Brazil", "Iran", "United States", "United Kingdom", "Qatar", "Philippines", "India", "Sri Lanka"):
            if region.lower() in text and region not in regions:
                regions.append(region)
    region_text = ", ".join(regions[:3]) if regions else "different parts of the world"
    phrase = editorial_category_phrase(category_label)
    return {
        "heading": "Conclusion",
        "body": (
            f"The developments from {region_text} point to broader interest in {phrase}. While the models "
            "differ by country and institution, the common thread is clear: learners are looking for more organised "
            "instruction, stronger guidance, and learning formats that can continue beyond a single classroom session. "
            "The trend is not only about more enrolment; it is about how education providers structure learning so that "
            "students can sustain progress over time."
        ),
    }


def pakistan_students_section(category_label: str | None) -> dict:
    focus = category_focus(category_label)
    return {
        "heading": "What it means for Pakistani students",
        "body": (
            f"For Pakistani students, the practical value is in connecting the news to {focus}. A student should "
            "ask three questions: which requirement affects me, which skill is weakest today, and what evidence "
            "will show improvement next week? For English and IELTS this may be a marked essay or speaking recording. "
            "For competitive exams it may be a timed score sheet. For Quran learning it may be corrected tajweed and "
            "a hifz revision record. For technology or design it may be a finished project that can be shown to a teacher, "
            "client, or admissions officer."
        ),
    }


def parent_guidance_section(category_label: str | None) -> dict:
    return {
        "heading": "What parents should do",
        "body": (
            "Parents should avoid reacting to education news with panic or last-minute tuition. A better response is "
            "to ask for a short diagnostic check, a visible weekly plan, and simple progress evidence. The best tutor "
            "is not the one who only gives more homework; it is the one who can identify the learner's gap, explain it "
            "clearly, and show whether the gap is closing."
        ),
    }


def tutor_guidance_section(category_label: str | None) -> dict:
    outcome = category_outcome(category_label)
    return {
        "heading": "What tutors should do",
        "body": (
            f"Tutors should connect every lesson to a measurable outcome such as {outcome}. This makes the lesson useful "
            "for the student and trustworthy for the parent. It also improves article relevance for A Plus Academy because "
            "the advice comes back to real tutoring work: diagnosis, correction, practice, feedback, and follow-up."
        ),
    }


def expert_view_section(category_label: str | None) -> dict:
    actions = category_actions(category_label)
    action_text = " ".join(actions[:2])
    return {
        "heading": "A Plus Academy's expert view",
        "body": (
            "The strongest response to education updates is a calm plan with expert feedback. A Plus Academy's view is "
            "that families should not treat news headlines as pressure; they should use them as prompts to check readiness. "
            f"{action_text} This keeps learning specific, local, and useful for Pakistani students rather than turning the "
            "article into generic advice."
        ),
    }


def build_takeaways(selected_items: list[dict], category_label: str | None) -> list[str]:
    takeaways = []
    for item in selected_items[:3]:
        title = strip_source_from_title(item["title"], item.get("source", ""))
        takeaways.append(trim_text(title, 120))
    if len(takeaways) < 3:
        takeaways.append(f"The common theme is growing structure around {category_focus(category_label)}.")
    return takeaways[:3]


def build_post(
    items: list[dict],
    topic: str | None,
    image_mode: str,
    category: dict | None = None,
    replace_slug: str | None = None,
    preserve_published_at: str | None = None,
) -> dict:
    if len(items) < 3:
        raise RuntimeError("At least three news sources are needed to create a referenced blog post.")

    now = dt.datetime.now(dt.timezone.utc)
    display_date = now.strftime("%B %d, %Y")
    category_label = category["label"] if category else None
    chosen_topic = choose_topic(items, topic, category_label)
    slug = replace_slug or f"{now.strftime('%Y-%m-%d')}-{slugify(chosen_topic)}"
    images = choose_images(chosen_topic, items, slug, image_mode, category_label)
    hero_image = images[0]

    title = chosen_topic
    description = (
        f"A concise education-news summary covering recent developments in {category_label or 'education'} "
        "and the common themes connecting them."
    )

    selected_items = items[:3]
    for item in selected_items:
        item["articleContext"] = extract_article_context(item)

    source_analyses = [
        source_analysis(item, chosen_topic, index + 1, category_label)
        for index, item in enumerate(selected_items)
    ]

    source_observation = summarize_source(selected_items[0], category_label)

    sections = [
        {
            "heading": "Overview",
            "body": (
                f"Interest in {editorial_category_phrase(category_label)} continues to develop across different regions and institutions. "
                f"Recent items in the news point to a shared pattern: {source_observation}\n\n"
                "While each story comes from a different context, the common theme is a move toward more structured "
                "learning, clearer teaching standards, and sustained engagement beyond occasional study. The sections "
                "below summarise the key developments first, then draw out the themes connecting them."
            ),
        },
        global_context_section(chosen_topic, selected_items, category_label),
        emerging_themes_section(chosen_topic, selected_items, category_label),
        digital_learning_section(category_label),
        conclusion_section(chosen_topic, selected_items, category_label),
    ]

    references = [
        {
            "title": item["title"],
            "source": item["source"],
            "url": item["url"],
            "publishedAt": item["publishedAt"],
        }
        for item in items[:8]
    ]

    word_count = (
        sum(len(section["body"].split()) for section in sections)
        + sum(len(analysis["summary"].split()) for analysis in source_analyses)
        + len(description.split())
    )
    read_minutes = max(3, round(word_count / 220))

    return {
        "slug": slug,
        "title": title,
        "seoTitle": title,
        "description": description,
        "topic": chosen_topic,
        "category": category_label or "Education",
        "publishedAt": preserve_published_at or now.isoformat(),
        "updatedAt": now.isoformat(),
        "readTime": f"{read_minutes} min read",
        "wordCount": word_count,
        "heroImage": hero_image,
        "images": images,
        "takeaways": build_takeaways(selected_items, category_label),
        "sections": sections,
        "sourceAnalyses": source_analyses,
        "references": references,
        "tags": sorted({word.lower() for word in re.findall(r"[a-zA-Z]{4,}", chosen_topic)})[:8],
        "generatedBy": "scripts/create_blog.py",
        "generationNote": (
            "Created from public RSS/news summaries, relevance filtering, "
            "and original editorial synthesis. References are included for attribution and reader verification."
        ),
    }


def load_index() -> list[dict]:
    if not BLOG_INDEX.exists():
        return []
    try:
        data = json.loads(BLOG_INDEX.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        return []


def parse_published_at(value: str) -> dt.datetime | None:
    if not value:
        return None
    try:
        return dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def find_recent_duplicate(topic: str, days: int) -> dict | None:
    cutoff = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=days)
    topic_key = slugify(topic)
    for post in load_index():
        published_at = parse_published_at(post.get("publishedAt", ""))
        if published_at is None or published_at < cutoff:
            continue

        existing_topic = post.get("topic") or post.get("title", "")
        if slugify(existing_topic) == topic_key:
            return post
    return None


def load_post(slug: str) -> dict | None:
    post_path = BLOG_DIR / f"{slug}.json"
    if not post_path.exists():
        return None
    try:
        data = json.loads(post_path.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else None
    except json.JSONDecodeError:
        return None


def normalize_category(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def category_last_published(category_label: str) -> dt.datetime | None:
    normalized = normalize_category(category_label)
    dates = []
    for post in load_index():
        post_category = post.get("category") or post.get("topic") or ""
        if normalize_category(post_category).startswith(normalized):
            published_at = parse_published_at(post.get("publishedAt", ""))
            if published_at:
                dates.append(published_at)
    return max(dates) if dates else None


def resolve_category(category_name: str | None) -> dict | None:
    if not category_name:
        return None
    requested = normalize_category(category_name)
    for category in BLOG_CATEGORIES:
        if normalize_category(category["label"]) == requested:
            return category
    labels = ", ".join(category["label"] for category in BLOG_CATEGORIES)
    raise ValueError(f"Unknown category {category_name!r}. Choose one of: {labels}")


def choose_daily_category(duplicate_window_days: int) -> dict:
    now = dt.datetime.now(dt.timezone.utc)
    offset = now.toordinal() % len(BLOG_CATEGORIES)
    ordered = BLOG_CATEGORIES[offset:] + BLOG_CATEGORIES[:offset]
    cutoff = now - dt.timedelta(days=duplicate_window_days)

    for category in ordered:
        last_published = category_last_published(category["label"])
        if last_published is None or last_published < cutoff:
            return category

    return min(
        BLOG_CATEGORIES,
        key=lambda category: category_last_published(category["label"]) or dt.datetime.min.replace(tzinfo=dt.timezone.utc),
    )


def write_post(post: dict, replace_slug: str | None = None) -> Path:
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    post_path = BLOG_DIR / f"{post['slug']}.json"

    if replace_slug:
        post["slug"] = replace_slug
        post_path = BLOG_DIR / f"{replace_slug}.json"
    else:
        suffix = 2
        while post_path.exists():
            post["slug"] = re.sub(r"-\d+$", "", post["slug"]) + f"-{suffix}"
            post_path = BLOG_DIR / f"{post['slug']}.json"
            suffix += 1

    post_path.write_text(json.dumps(post, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    index = [item for item in load_index() if item.get("slug") != post["slug"]]
    index.insert(
        0,
        {
            "slug": post["slug"],
            "title": post["title"],
            "description": post["description"],
            "topic": post["topic"],
            "category": post.get("category", "Education"),
            "publishedAt": post["publishedAt"],
            "readTime": post["readTime"],
            "heroImage": post["heroImage"],
        },
    )
    index = sorted(index, key=lambda item: item.get("publishedAt", ""), reverse=True)[:60]
    BLOG_INDEX.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    update_sitemap(post["slug"])
    return post_path


def update_sitemap(slug: str) -> None:
    if not SITEMAP.exists():
        return

    ET.register_namespace("", "http://www.sitemaps.org/schemas/sitemap/0.9")
    tree = ET.parse(SITEMAP)
    root = tree.getroot()
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    existing = {loc.text for loc in root.findall("sm:url/sm:loc", namespace)}
    today = dt.datetime.now(dt.timezone.utc).date().isoformat()

    def add_url(loc: str, priority: str) -> None:
        if loc in existing:
            return
        url = ET.SubElement(root, "{http://www.sitemaps.org/schemas/sitemap/0.9}url")
        ET.SubElement(url, "{http://www.sitemaps.org/schemas/sitemap/0.9}loc").text = loc
        ET.SubElement(url, "{http://www.sitemaps.org/schemas/sitemap/0.9}lastmod").text = today
        ET.SubElement(url, "{http://www.sitemaps.org/schemas/sitemap/0.9}priority").text = priority

    add_url(f"{SITE_URL}/blog", "0.8")
    add_url(f"{SITE_URL}/blog/{slug}", "0.7")
    tree.write(SITEMAP, encoding="utf-8", xml_declaration=True)


def run_git(args: list[str]) -> None:
    subprocess.run(args, cwd=ROOT, check=True)


def publish(post: dict, post_path: Path) -> None:
    paths = [
        str(post_path.relative_to(ROOT)),
        str(BLOG_INDEX.relative_to(ROOT)),
        str(SITEMAP.relative_to(ROOT)),
    ]
    for image in post.get("images", []):
        url = image.get("url", "")
        if url.startswith("/blogs/images/"):
            image_path = ROOT / "frontend" / "public" / url.lstrip("/")
            if image_path.exists():
                paths.append(str(image_path.relative_to(ROOT)))
    run_git(["git", "add", *paths])
    run_git(["git", "commit", "-m", f"Publish blog: {post['title'][:50]}"])
    run_git(["git", "push", "origin", "main"])


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate an original referenced A Plus Academy education blog post."
    )
    parser.add_argument(
        "--category",
        help="Pick one category from the approved list. If omitted, the script rotates daily.",
    )
    parser.add_argument("--topic", help="Force a topic instead of selecting one from trending news.")
    parser.add_argument("--max-sources", type=int, default=6, help="Number of source items to cite.")
    parser.add_argument(
        "--image-mode",
        choices=["auto", "ai", "pexels"],
        default=os.environ.get("BLOG_IMAGE_MODE", "auto"),
        help="Use AI images when OPENAI_API_KEY is available, require AI, or use Pexels fallback.",
    )
    parser.add_argument(
        "--duplicate-window-days",
        type=int,
        default=int(os.environ.get("BLOG_DUPLICATE_WINDOW_DAYS", "9")),
        help="Prefer categories not used within this many days. Daily publishing still continues.",
    )
    parser.add_argument(
        "--allow-duplicate",
        action="store_true",
        help="Force publishing even if the same topic was recently published.",
    )
    parser.add_argument(
        "--replace-slug",
        help="Overwrite an existing blog JSON while keeping its URL. Useful for quality revisions.",
    )
    parser.add_argument("--publish", action="store_true", help="Commit and push the generated post.")
    parser.add_argument("--dry-run", action="store_true", help="Print the post without writing files.")
    args = parser.parse_args()

    existing_post = load_post(args.replace_slug) if args.replace_slug else None
    if args.replace_slug and existing_post is None:
        raise RuntimeError(f"Cannot replace missing blog post: {args.replace_slug}")

    requested_category = resolve_category(args.category)
    if existing_post and not requested_category:
        requested_category = resolve_category(existing_post.get("category"))
    category = requested_category or choose_daily_category(args.duplicate_window_days)

    attempts = [category]
    if not requested_category:
        attempts.extend(candidate for candidate in BLOG_CATEGORIES if candidate is not category)

    post = None
    for candidate in attempts:
        items = gather_news(args.topic, max(3, args.max_sources), candidate)
        selected_topic = choose_topic(items, args.topic, candidate["label"])
        duplicate = find_recent_duplicate(selected_topic, args.duplicate_window_days)
        if duplicate and not args.allow_duplicate and not requested_category:
            print(
                "Trying another category because "
                f"'{selected_topic}' was recently published at {SITE_URL}/blog/{duplicate['slug']}"
            )
            continue
        post = build_post(
            items,
            selected_topic,
            args.image_mode,
            candidate,
            replace_slug=args.replace_slug,
            preserve_published_at=existing_post.get("publishedAt") if existing_post else None,
        )
        break

    if post is None:
        fallback_category = choose_daily_category(0)
        items = gather_news(args.topic, max(3, args.max_sources), fallback_category)
        selected_topic = choose_topic(items, args.topic, fallback_category["label"])
        post = build_post(
            items,
            selected_topic,
            args.image_mode,
            fallback_category,
            replace_slug=args.replace_slug,
            preserve_published_at=existing_post.get("publishedAt") if existing_post else None,
        )

    if args.dry_run:
        sys.stdout.buffer.write((json.dumps(post, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
        return 0

    post_path = write_post(post, args.replace_slug)
    print(f"Created blog post: {post_path.relative_to(ROOT)}")
    print(f"URL after deployment: {SITE_URL}/blog/{post['slug']}")
    print("\nImportant: this is an original synthesis, not copied article text.")
    print(textwrap.fill("Sources and image credit were written into the post references.", width=80))

    if args.publish:
        publish(post, post_path)
        print("Committed and pushed. Vercel will deploy from GitHub.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
