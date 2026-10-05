/** Per-page metadata, titles and lead paragraphs, plus the prose that belongs to one page only. */

export const workPage = {
  title: "Work",
  description: "Every build with its case notes: what the problem was, what got built, what it runs on, and how it went.",
  lead: "Everything I have shipped or am shipping, with the notes I would want if I were reading about it cold.",
} as const;

export const researchPage = {
  title: "Research",
  description:
    "FPGA acceleration for machine learning and wireless signal processing at Santa Clara University's Wireless Intelligent Networks Lab, the ROAR Academy, and the BALANCE article.",
  lead: "Most of my research is about what an algorithm can do once the hardware sets the budget: how much of a model survives quantization, and how fast a channel estimate can come out of an FPGA.",
  pipelineCaption:
    "The path a model takes from training to the fabric. Live samples from the radio front end enter the same fabric for channel estimation and signal processing.",
} as const;

export const patentPage = {
  title: "BALANCE",
  description:
    "A hybrid wheeled and legged mobility device, co-developed with a student team. Provisional patent 63/743,085 and a design article in the Youth Innovation Journal.",
  signalPathCaption:
    "LiDAR, sonar and cameras feed the on-board computer, which maps the ground and picks a mode; the wheeled base handles flat ground and the powered legs take stairs and uneven terrain.",
  poseCaptions: {
    rolling: "Rolling: the wheels carry the frame on flat ground while the feet fold up behind the shanks.",
    stepping: "Stepping: the feet plant, the knees bend, and the wheels lift clear of the step.",
  },
} as const;

export const archivePage = {
  title: "Archive",
  description: "Earlier work, kept for the record: competitive robotics, science fair builds, teaching, and the rest.",
  lead: "This is earlier work, kept for the record. Most of it is from high school, and some of it explains where the rest came from.",
} as const;

export const aboutPage = {
  title: "About",
  description:
    "Tarun Yadgirkar builds where hardware meets AI, from FPGAs to AR glasses, and studies applied mathematics at UC Berkeley. What drives the work, and how to reach him.",
  paragraphs: [
    "I want to change the world by a measurable amount, and I have found that the way to do that is to keep trying things I don't know how to do yet. Most of what I make sits where software meets the physical world: models that have to run on a chip with a fixed budget, machines that have to hold a person up, and glasses that have to know where the walls are.",
    "Right now that means two things. At Santa Clara University's Wireless Intelligent Networks Lab I research how far a machine-learning model can be pushed onto an FPGA before quantization and the clock budget break it, and I do the same for channel estimation on live radio samples. With Boris Nezlobin I co-founded Vantage, a pair of AR glasses and the spatial operating system inside them, where the prototype already runs as a Linux-based OS with optical gesture recognition and LiDAR room mapping while the hardware is in design.",
    "Before that I spent a summer at Rainier Labs, a robotics startup, helping build robot dogs and an expressive robot head, and with a student team I co-developed BALANCE, a hybrid wheeled and legged mobility device that we filed as a provisional patent and published in the Youth Innovation Journal.",
    "I explore widely on purpose. I build at hackathons most months, usually voice-first applied AI, and I keep the prototypes running afterward so strangers can use them and tell me what breaks. I study applied mathematics at UC Berkeley, which underlies every one of these projects.",
    "If you are working on something that changes how people live with machines, I would like to hear about it.",
  ],
} as const;
