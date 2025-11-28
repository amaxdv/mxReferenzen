// === Header Tab Control ===
const tabs = document.querySelectorAll(".tab-link");
const panes = document.querySelectorAll(".tab-pane");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {

    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    panes.forEach(pane => {
      pane.classList.remove("active");
      pane.classList.add("inactive");
    });

    const target = tab.dataset.tab;
    const activePane = document.getElementById(target);

    activePane.classList.remove("inactive");
    activePane.classList.add("active");
  });
});

// === Generate Project Cards ===
class ProjectCard {
    constructor({ title, image, description, demo, code }) {
        this.title = title;
        this.image = image;
        this.description = description;
        this.demo = demo;
        this.code = code;
    }

    renderProjectCard() {
        const card = document.createElement('div');
        card.className = 'project-card';

        // setup link fallback for #noDemo
        const demoLink = (this.demo && this.demo !== '#noDemo')
            ? `<a href="${this.demo}" target="_blank" rel="noreferrer noopener" class="btn">Live-Demo</a>`
            : `<a href="#" onclick="noDemo(); return false;" class="btn">Live-Demo</a>`;

        // build the container
        card.innerHTML = `
            <div class="project-thumb">
                <img src="${this.image}" alt="${this.title}">
            </div>

            <div class="project-content">
                <h3>${this.title}</h3>
                <p>${this.description}</p>

                <div class="project-links">
                    ${demoLink}
                    <a href="${this.code}" target="_blank" rel="noreferrer noopener"
                       class="btn btn-secondary">
                       <i class="fa">&#xf09b;</i> Code
                    </a>
                </div>
            </div>
        `;

        return card;
    }
}

function noDemo () {
    window.alert("Für dieses Projekt ist keine Live-Demo verfügbar. Für weitere Informationen kontaktieren Sie mich gerne direkt.");
};

// ++ Projectcard Content Blueprint ++
/*
ID;
title;
image;
description;
description;
description;
demo;
code;
*/

async function loadDataCSV() {
    const resp = await fetch("projects.csv");
    const text = await resp.text();
    const lines = text.trim().split("\n");

    const container = document.getElementById("portfolio-div");
    let current = null;
    const projects = [];

    for (let rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        const [key, ...valueParts] = line.split(";");
        const value = valueParts.join(";").trim();

        if (key === "ID") {
            if (current) projects.push(current);
                current = {
                    id: value,
                    title: "",
                    image: "",
                    description: [],
                    demo: "",
                    code: ""
            };
        } else if (current) {
            if (key === "description") {
                current.description.push(value);
            } else {
                current[key] = value;
            }
        }
    }

    if (current) projects.push(current);

    for (const proj of projects) {
        const card = new ProjectCard({
            title: proj.title,
            image: proj.image,
            description: proj.description.join("\n"),
            demo: proj.demo,
            code: proj.code
        }).renderProjectCard();

    container.appendChild(card);
    }
}

loadDataCSV()