/**
 * Define Utility Class
 */

class Utility {
  /**
   * Generate Random String
   */
  public static generateRandomString(length: number = 10): string {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let result = "";

    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
  }

  /**
   * Generate Slug from Text
   */
  public static generateSlugFromText(text: string): string {
    if (!text) throw new Error("Text is not defined");

    const slug = text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");

    const random = this.generateRandomString(10);

    return `${slug}-${random}`;
  }

  /**
   * Shuffle Array
   */
  public static shuffleList(list: any[]): any[] {
    let currentIndex = list.length;
    let randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [list[currentIndex], list[randomIndex]] = [
        list[randomIndex],
        list[currentIndex],
      ];
    }

    return list;
  }
}

export default Utility;
