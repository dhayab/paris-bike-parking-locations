import './modal.scss';

export enum ModalType {
	Error = 'error',
	Loading = 'loading',
}

const template = `
<modal class="modal">
	<div class="modal__content">
		<p class="modal__text"></p>
	</div>
</modal>
`;

export class Modal {
	private readonly modal: HTMLElement;

	constructor() {
		document.body.insertAdjacentHTML('beforeend', template);
		this.modal = document.querySelector('modal') as HTMLElement;
	}

	close() {
		this.modal.className = 'modal';
		this.message = undefined;
	}

	open(type: ModalType, message: string) {
		this.isOpen && this.close();

		this.modal.classList.add('modal--visible', `modal--${type}`);
		this.message = message;
	}

	private get isOpen() {
		return this.modal.classList.contains('modal--visible');
	}

	private set message(value: string | undefined) {
		this.modal.querySelector('.modal__text')!.textContent = value || '';
	}
}
