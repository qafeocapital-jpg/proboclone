import { ENV } from '@/config/env';
import { logger } from '@/utils/logger';
import { twilioClient } from './client';

/**
 * Sends an OTP to the user's phone number.
 *
 * @param phone users phone number to send otp
 * @param otp one time password to send
 */

export const sendOtp = async (phone: string, otp: string) => {
	if (ENV.TWILIO_TOKEN === 'dummy' || ENV.TWILIO_SID === 'AC00000000000000000000000000000000') {
		logger.warn({ phone, otp }, 'Skipping Twilio OTP send because dummy credentials are configured');
		return;
	}

	try {
		await twilioClient.messages.create({
			body: `Your OTP is ${otp}. It’s valid for 5 minutes.`,
			from: ENV.TWILIO_NUMBER,
			to: phone,
		});
	} catch (error) {
		logger.error(`Twilio failed for ${phone}`, error);
		throw new Error('Failed to send OTP');
	}
};
