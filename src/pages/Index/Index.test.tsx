import * as React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Index from './Index';
import { getEvents, addEvent, getView, getFields } from '@/services/services';
import { mock_customerIndex, mock_getStatistics, mock_mawStaff, mock_joinOutStaff, mock_sbxzCostChange, mock_companyStaffInfo } from './mockService';
import { setMedia } from "mock-match-media";
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

import { customerIndex, getStatistics, mawStaff, joinOutStaff, sbxzCostChange, companyStaffInfo } from './service';

jest.mock('./service', () => ({
    customerIndex: jest.fn(),
    getStatistics: jest.fn(),
    mawStaff: jest.fn(),
    joinOutStaff: jest.fn(),
    sbxzCostChange: jest.fn(),
    companyStaffInfo: jest.fn(),
}));

beforeEach(async () => {
    customerIndex.mockImplementation(mock_customerIndex);
    getStatistics.mockImplementation(mock_getStatistics);
    mawStaff.mockImplementation(mock_mawStaff);
    joinOutStaff.mockImplementation(mock_joinOutStaff);
    sbxzCostChange.mockImplementation(mock_sbxzCostChange);
    companyStaffInfo.mockImplementation(mock_companyStaffInfo);
});

describe("Index page", () => {
    it('Renders the table with data from mock json-server', async () => {
        fakeGetEvents.mockImplementation(getMockEvents);
        render(<Index/>);
        expect(await screen.findByText(/title/i)).toBeInTheDocument();
    });

    it('Renders the table with given data', async () => {
        const oneItemData: EventItemWithId[] =  [
            {
                "title": "Gathering",
                "type": "generic",
                "startDate": "2022-01-02",
                "endDate": "2022-12-01",
                "description": "Some event",
                "id": "1"
            },
        ];
        fakeGetEvents.mockReturnValue(oneItemData);
        const { findByText, getByText } = render(<Index/>);
        expect(await findByText(eval(`/${oneItemData[0].title}/i`))).toBeInTheDocument();
        expect(getByText(eval(`/${oneItemData[0].type}/i`))).toBeInTheDocument();
        expect(getByText(eval(`/${oneItemData[0].startDate}/i`))).toBeInTheDocument();
        expect(getByText(eval(`/${oneItemData[0].endDate}/i`))).toBeInTheDocument();
        expect(getByText(eval(`/${oneItemData[0].description}/i`))).toBeInTheDocument();
    });

    it('Renders the table and creates an Event.', async () => {
        fakeGetEvents.mockImplementation(getMockEvents);
        render(<Index/>);
        expect(await screen.findByText(/title/i)).toBeInTheDocument();
        const createEventButtonText: HTMLElement = await screen.findByText("Create event");
        const createEventButton: Element = createEventButtonText.parentElement as Element;
        const user: UserEvent = userEvent.setup();
        await user.click(createEventButton);

        const titleInput: HTMLInputElement = await screen.findByLabelText("Title");
        const randomNum: number = Math.round(Math.random() * 1000);
        const randomTitle: string = `Event ${randomNum}`;
        await user.type(titleInput, randomTitle);
        expect(titleInput).toHaveValue(randomTitle);

        const descriptionTextarea: HTMLTextAreaElement = screen.getByLabelText("Description");
        await user.type(descriptionTextarea, "My description.");

        const saveButton: HTMLButtonElement = screen.getByRole("button", {name: "Save"});
        await user.click(saveButton);

        await waitForElementToBeRemoved(descriptionTextarea); // Modal has been closed
        const successMessage: HTMLElement = await screen.findByText("Saved successfully.");
        const titleCell: HTMLElement = await screen.findByText(randomTitle);
        expect(successMessage).toBeInTheDocument();
        expect(titleCell).toBeInTheDocument();
    });
});
