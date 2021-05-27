class TimeFormatting {
  #getFactory = (type: "SECONDS" | "MINUTES" | "HOURS"): any => {
    switch(type) {
        case "SECONDS": return 1000;
        case "MINUTES": return 1000 * 60;
        case "HOURS": return 1000 * 60 * 60;
        default: return "TimeFormatting-getFactory: no such type."
    }
  }

  seconds = (date: number) => Math.floor((Date.now() - date) / this.#getFactory("SECONDS"));
  minutes = (date: number) => Math.floor((Date.now() - date) / this.#getFactory("MINUTES"));
  hours = (date: number) => Math.floor((Date.now() - date) / this.#getFactory("HOURS"));
}

export default TimeFormatting;