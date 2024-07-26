import type ProfileService from "../../services/ProfileService";
import StatusCodes from "../../constants/statusCodes";
import StringValues from "../../constants/strings";
import ApiError from "../../exceptions/ApiError";
import MailServiceHelper from "../../helpers/MailServiceHelper";
import EmailTemplateHelper from "../../helpers/MailTemplateHelper";
import OtpServiceHelper from "../../helpers/OtpServiceHelper";
import type { IRegisterBodyData } from "../../interfaces/bodyData";
import type { IRequest, IResponse, INext } from "../../interfaces/core/express";
import type { IUser } from "../../interfaces/entities/user";
import Logger from "../../logger";
import Otp from "../../models/Otp";
import type UserService from "../../services/UserService";
import Validators from "../../utils/validator";
import { EHttpMethod } from "../../enums";

class RegisterController {
  private readonly _userSvc: UserService;
  private readonly _profileSvc: ProfileService;

  constructor(
    readonly userSvc: UserService,
    readonly profileSvc: ProfileService
  ) {
    this._userSvc = userSvc;
    this._profileSvc = profileSvc;
  }

  /**
   * @name sendRegisterOtp
   * @description Perform send register otp action.
   * @param req IRequest
   * @param res IResponse
   * @param next INext
   * @returns Promise<any>
   */
  public sendRegisterOtp = async (
    req: IRequest,
    res: IResponse,
    next: INext
  ): Promise<any> => {
    if (req.method !== EHttpMethod.POST) {
      return next(
        new ApiError(StringValues.INVALID_REQUEST_METHOD, StatusCodes.NOT_FOUND)
      );
    }

    try {
      const {
        fname,
        lname,
        email,
        username,
        password,
        confirmPassword,
      }: IRegisterBodyData = req.body;

      if (!fname) {
        return next(
          new ApiError(
            StringValues.FIRST_NAME_REQUIRED,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (!lname) {
        return next(
          new ApiError(StringValues.LAST_NAME_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (!email) {
        return next(
          new ApiError(StringValues.EMAIL_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (!Validators.validateEmail(email)) {
        return next(
          new ApiError(
            StringValues.INVALID_EMAIL_FORMAT,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (!username) {
        return next(
          new ApiError(StringValues.USERNAME_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (!Validators.validateUsername(username)) {
        return next(
          new ApiError(
            StringValues.INVALID_USERNAME_FORMAT,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (!password) {
        return next(
          new ApiError(StringValues.PASSWORD_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (password.length < 8) {
        return next(
          new ApiError(
            StringValues.PASSWORD_MIN_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (password.length > 32) {
        return next(
          new ApiError(
            StringValues.PASSWORD_MAX_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (!confirmPassword) {
        return next(
          new ApiError(
            StringValues.CONFIRM_PASSWORD_REQUIRED,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (confirmPassword.length < 8) {
        return next(
          new ApiError(
            StringValues.CONFIRM_PASSWORD_MIN_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (confirmPassword.length > 32) {
        return next(
          new ApiError(
            StringValues.CONFIRM_PASSWORD_MAX_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (password.trim() !== confirmPassword.trim()) {
        return next(
          new ApiError(
            StringValues.PASSWORDS_DO_NOT_MATCH,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      const _fname = fname?.trim();
      const _lname = lname?.trim();
      const _email = email?.toLowerCase().trim();
      const _username = username?.trim();

      const isEmailExists = await this._userSvc.checkIsEmailExistsExc(_email);
      if (isEmailExists) {
        res.status(StatusCodes.BAD_REQUEST);
        return res.json({
          success: false,
          message: StringValues.EMAIL_ALREADY_REGISTERED,
          isEmailUsed: true,
        });
      }

      const isUsernameExists = await this._userSvc.checkIsUsernameExistsExc(
        _username
      );
      if (isUsernameExists) {
        res.status(StatusCodes.BAD_REQUEST);
        return res.json({
          success: false,
          message: StringValues.USERNAME_ALREADY_REGISTERED,
          isUsernameUsed: true,
        });
      }

      // Generating OTP
      const newOtp = await OtpServiceHelper.generateOtpFromEmail(_email);

      if (!newOtp) {
        return next(
          new ApiError(StringValues.OTP_CREATE_ERROR, StatusCodes.BAD_REQUEST)
        );
      }

      // Sending Email
      const htmlMessage = await EmailTemplateHelper.getOtpEmail(
        newOtp.otp,
        `${_fname} ${_lname}`
      );

      if (htmlMessage) {
        await MailServiceHelper.sendEmail({
          to: _email,
          subject: "OTP For Registration",
          htmlContent: htmlMessage,
        });
      }

      res.status(StatusCodes.OK);
      return res.json({
        success: true,
        message: StringValues.SUCCESS,
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || error || StringValues.SOMETHING_WENT_WRONG;

      Logger.getInstance().error(
        "RegisterController: sendRegisterOtp",
        "errorInfo:" + JSON.stringify(error)
      );

      res.status(StatusCodes.BAD_REQUEST);
      return res.json({
        success: false,
        error: errorMessage,
      });
    }
  };

  /**
   * @name registerUser
   * @description Perform register user action.
   * @param req IRequest
   * @param res IResponse
   * @param next INext
   * @returns Promise<any>
   */
  public register = async (
    req: IRequest,
    res: IResponse,
    next: INext
  ): Promise<any> => {
    if (req.method !== EHttpMethod.POST) {
      return next(
        new ApiError(StringValues.INVALID_REQUEST_METHOD, StatusCodes.NOT_FOUND)
      );
    }

    try {
      const {
        fname,
        lname,
        email,
        username,
        password,
        confirmPassword,
        otp,
      }: IRegisterBodyData = req.body;

      if (!fname) {
        return next(
          new ApiError(
            StringValues.FIRST_NAME_REQUIRED,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (!lname) {
        return next(
          new ApiError(StringValues.LAST_NAME_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (!email) {
        return next(
          new ApiError(StringValues.EMAIL_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (!Validators.validateEmail(email)) {
        return next(
          new ApiError(
            StringValues.INVALID_EMAIL_FORMAT,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (!username) {
        return next(
          new ApiError(StringValues.USERNAME_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (!Validators.validateUsername(username)) {
        return next(
          new ApiError(
            StringValues.INVALID_USERNAME_FORMAT,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (!password) {
        return next(
          new ApiError(StringValues.PASSWORD_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (password.length < 8) {
        return next(
          new ApiError(
            StringValues.PASSWORD_MIN_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (password.length > 32) {
        return next(
          new ApiError(
            StringValues.PASSWORD_MAX_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (!confirmPassword) {
        return next(
          new ApiError(
            StringValues.CONFIRM_PASSWORD_REQUIRED,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (confirmPassword.length < 8) {
        return next(
          new ApiError(
            StringValues.CONFIRM_PASSWORD_MIN_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (confirmPassword.length > 32) {
        return next(
          new ApiError(
            StringValues.CONFIRM_PASSWORD_MAX_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (password.trim() !== confirmPassword.trim()) {
        return next(
          new ApiError(
            StringValues.PASSWORDS_DO_NOT_MATCH,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (!otp) {
        return next(
          new ApiError(StringValues.OTP_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (otp.length !== 6) {
        return next(
          new ApiError(StringValues.INVALID_OTP, StatusCodes.BAD_REQUEST)
        );
      }

      const _fname = fname?.trim();
      const _lname = lname?.trim();
      const _email = email?.toLowerCase().trim();
      const _username = username?.trim();
      const _otp = otp?.trim();

      const isEmailExists = await this._userSvc.checkIsEmailExistsExc(_email);
      if (isEmailExists) {
        res.status(StatusCodes.BAD_REQUEST);
        return res.json({
          success: false,
          message: StringValues.EMAIL_ALREADY_REGISTERED,
          isEmailUsed: true,
        });
      }

      const isUsernameExists = await this._userSvc.checkIsUsernameExistsExc(
        _username
      );
      if (isUsernameExists) {
        res.status(StatusCodes.BAD_REQUEST);
        return res.json({
          success: false,
          message: StringValues.USERNAME_ALREADY_REGISTERED,
          isUsernameUsed: true,
        });
      }

      const otpObj = await Otp.findOne({ otp: _otp, email: _email });

      if (!otpObj) {
        return next(
          new ApiError(StringValues.INCORRECT_OTP, StatusCodes.BAD_REQUEST)
        );
      }

      if (await otpObj.isExpired()) {
        return next(
          new ApiError(StringValues.OTP_EXPIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (await otpObj.isAleadyUsed()) {
        return next(
          new ApiError(StringValues.OTP_ALREADY_USED, StatusCodes.BAD_REQUEST)
        );
      }

      const _currentDateTime = new Date(Date.now());

      // Create User
      const newUserData: IUser = {
        fname: _fname,
        lname: _lname,
        nameChangedAt: _currentDateTime,
        email: _email,
        isEmailVerified: true,
        emailChangedAt: _currentDateTime,
        username: _username,
        usernameChangedAt: _currentDateTime,
      };

      const newUser = await this._userSvc.createUserExc(newUserData);

      // Set Password
      await newUser.setPassword(password.trim());

      await this._profileSvc.getProfileExc(newUser);

      // Create Recuiter Profile
      //  if (userType === EUserType.Recruiter) {
      //   await this._profileSvc.createRecruiterExc({
      //     userId: newUser._id,
      //     companyName: companyName.trim(),
      //     designation: designation.trim(),
      //   });
      // }

      // Send Welcome Email
      // const htmlMessage = await EmailTemplateHelper.getOtpEmail(_name);

      // if (htmlMessage) {
      //   await MailServiceHelper.sendEmail({
      //     to: _email,
      //     subject: "Welcome To NixLab Jobs",
      //     htmlContent: htmlMessage,
      //   });
      // }

      otpObj.isUsed = true;
      await otpObj.save();

      const authToken = await newUser.getToken();

      res.status(StatusCodes.CREATED);
      return res.json({
        success: true,
        message: StringValues.SUCCESS,
        data: {
          token: authToken.token,
          expiresAt: authToken.expiresAt,
        },
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || error || StringValues.SOMETHING_WENT_WRONG;

      Logger.getInstance().error(
        "RegisterController: register",
        "errorInfo:" + JSON.stringify(error)
      );

      res.status(StatusCodes.BAD_REQUEST);
      return res.json({
        success: false,
        error: errorMessage,
      });
    }
  };
}

export default RegisterController;
