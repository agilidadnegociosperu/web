(() => {
  const STYLE_ID = 'agne-calculator-input-icons';

  const mount = () => {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #calculadora .loss-form > label:nth-of-type(-n+3) .input-stepper{
        position:relative;
        grid-template-columns:minmax(0,1fr) 48px!important;
        overflow:hidden;
      }

      #calculadora .loss-form > label:nth-of-type(-n+3) .input-stepper::before{
        content:"";
        position:absolute;
        left:15px;
        top:50%;
        width:24px;
        height:24px;
        transform:translateY(-50%);
        z-index:3;
        pointer-events:none;
        background-position:center;
        background-repeat:no-repeat;
        background-size:contain;
      }

      #calculadora .loss-form > label:nth-of-type(1) .input-stepper::before{
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300233f' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 3v7M7 3v7M4 7h3M5.5 10v11'/%3E%3Cpath d='M13 3v8c0 1.6 1.2 2.8 2.8 2.8H17V21'/%3E%3Cpath d='M17 3v8'/%3E%3C/svg%3E");
      }

      #calculadora .loss-form > label:nth-of-type(2) .input-stepper::before{
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300233f' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='9' cy='8' r='3'/%3E%3Ccircle cx='17' cy='9' r='2.4'/%3E%3Cpath d='M3.5 20v-2.1c0-3.2 2.4-5.4 5.5-5.4s5.5 2.2 5.5 5.4V20'/%3E%3Cpath d='M14.7 13.8c.7-.4 1.5-.6 2.3-.6 2.3 0 4 1.6 4 4V20'/%3E%3C/svg%3E");
      }

      #calculadora .loss-form > label:nth-of-type(3) .input-stepper::before{
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300233f' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 10h16M6 10V7h12v3M6 10v10M18 10v10M4 14h16'/%3E%3C/svg%3E");
      }

      #calculadora .loss-form > label:nth-of-type(-n+3) .input-stepper input{
        padding-left:52px!important;
        padding-right:8px!important;
      }

      #calculadora .input-stepper > div{
        position:relative;
        z-index:4;
        background:transparent!important;
        border-left:1px solid #e0e7eb;
      }

      #calculadora .input-stepper button{
        background:transparent!important;
        border:0!important;
        color:#ff7900!important;
        box-shadow:none!important;
        font-size:17px!important;
        line-height:1!important;
        transition:color .15s ease,transform .15s ease,background .15s ease;
      }

      #calculadora .input-stepper button:first-child{
        border-bottom:1px solid #edf1f3!important;
      }

      #calculadora .input-stepper button:hover{
        background:#fff7ef!important;
        color:#f06400!important;
      }

      #calculadora .input-stepper button:active{
        transform:scale(.9);
      }

      @media(max-width:560px){
        #calculadora .loss-form > label:nth-of-type(-n+3) .input-stepper{
          grid-template-columns:minmax(0,1fr) 46px!important;
        }
        #calculadora .loss-form > label:nth-of-type(-n+3) .input-stepper::before{
          left:14px;
          width:22px;
          height:22px;
        }
        #calculadora .loss-form > label:nth-of-type(-n+3) .input-stepper input{
          padding-left:48px!important;
        }
      }
    `;

    document.head.appendChild(style);
  };

  document.addEventListener('DOMContentLoaded', mount);
  mount();
})();
