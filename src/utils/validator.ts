/**
 * Define Validators
 */

class Validators {
  /**
   * Validate Email
   */
  public static validateEmail(email: string): boolean {
    if (!email) throw new Error("Email is not defined");

    const EMAIL_REG_EXP: RegExp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return EMAIL_REG_EXP.test(email);
  }

  /**
   * Validate Username
   */
  public static validateUsername(username: string): boolean {
    if (!username) throw new Error("Username is not defined");

    const USERNAME_REG_EXP: RegExp = /^[A-Za-z0-9_]{1,16}$/;

    return USERNAME_REG_EXP.test(username);
  }

  /**
   * Validate Phone Number
   */
  public static validatePhone(phone: string): boolean {
    if (!phone) throw new Error("Phone is not defined");

    const PHONE_REG_EXP: RegExp = /^\d{10}$/;

    return PHONE_REG_EXP.test(phone);
  }

  /**
   * Validate URL
   */
  public static validateUrl(url: string): boolean {
    if (!url) throw new Error("URL is not defined");

    const URL_REG_EXP: RegExp =
      /^((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

    return URL_REG_EXP.test(url);
  }

  /**
   * Validate LinkedIn URL
   */
  public static validateLinkedUrl(url: string): boolean {
    if (!url) throw new Error("URL is not defined");

    const LINKED_URL_REG_EXP: RegExp =
      /(https?)?:?(\/\/)?(([w]{3}||\w\w)\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;

    return LINKED_URL_REG_EXP.test(url);
  }
}

export default Validators;
