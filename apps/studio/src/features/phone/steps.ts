import { PHONE_STEPS, type PhoneStep } from "@subiza/domain";

export function isPhoneStep(value: string): value is PhoneStep {
  return (PHONE_STEPS as readonly string[]).includes(value);
}

export function hrefForPhone(step: PhoneStep): string {
  return `/connections/phone/${step}`;
}
