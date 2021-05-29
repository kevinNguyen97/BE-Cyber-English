import "reflect-metadata";
import { singleton } from "tsyringe";
import { UnitsModel } from "../models/Units.model";
import BaseService from "./base.service";
import MultipleChoiceService from "./multipleChoice.service";
import VocabularyService from "./vocabularies.service";
import ListeningService from "./listening.service";
import { User } from "../models/User.model";
import { ProcessingData } from "../models/MultipleChoice";

@singleton()
class UnitService extends BaseService {
  private listUnit: UnitsModel[] = [];

  constructor(
    private multipleChoiceServ: MultipleChoiceService,
    private vocabularySev: VocabularyService,
    private listeningServ: ListeningService
  ) {
    super();
    this.nameSpace = "UnitService";
  }

  getAllUnit = (): Promise<UnitsModel[]> => {
    return new Promise((resolve, reject) => {
      if (this.listUnit && this.listUnit.length) {
        resolve(this.listUnit);
      } else {
        this.connection.query(`SELECT * FROM units;`, (err, result) => {
          if (err) {
            this.log(err, "");
            return reject(err);
          }
          resolve(
            result && result.length
              ? result.map((item: any) => new UnitsModel(item))
              : []
          );
        });
      }
    });
  };

  checkUnitsExist = (unit: number): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      const allUnit = await this.getAllUnit();
      const isExist = allUnit.find((item) => item.unit === unit);
      resolve(!!isExist);
    });
  };

  getUnitDetail = (unit: number): Promise<UnitsModel> => {
    return new Promise(async (resolve, reject) => {
      const allUnit = await this.getAllUnit();
      const isExist = allUnit.find((item) => item.unit === unit);
      resolve(isExist ? isExist : new UnitsModel());
    });
  };

  getMaxUnit = (): Promise<number> => {
    return new Promise(async (resolve, reject) => {
      const allUnit = await this.getAllUnit();
      const maxUnit = Math.max.apply(
        null,
        allUnit.map((item) => item.unit)
      );
      resolve(maxUnit);
    });
  };

  canUpdateCurrentUnit = (
    user: User,
    unit: number,
    type: "mupliple" | "listening",
    data: ProcessingData
  ): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      const unitDetail = await this.getUnitDetail(unit);

      const multipleGetData = async () => {
        if (type === "mupliple") {
          return {
            corected: data.corected,
            total: data.total,
          };
        }
        const multipleChoiceAnswered = await this.multipleChoiceServ.getAllQuestionHaveDoneByUnit(
          user.id,
          unit
        );
        const total = await this.vocabularySev.getListVocabularyByUnit(unit);
        const corected = multipleChoiceAnswered.filter((item) => item.isDone)
          .length;
        return {
          total: total.length,
          corected,
        };
      };

      const multipleData = await multipleGetData();

      if (
        !(
          multipleData.corected >=
          (unitDetail?.quantityMultipleChoiceAnswerRequired > 0
            ? unitDetail.quantityMultipleChoiceAnswerRequired
            : multipleData.total)
        )
      ) {
        return resolve(false);
      }

      const listeningGetData = async () => {
        if (type === "listening") {
          return {
            corected: data.corected,
            total: data.total,
          };
        }
        const listeningAnswered = await this.listeningServ.getAllQuestionHaveDoneByUnit(
          user.id,
          unit
        );
        const total = await this.vocabularySev.getListVocabularyByUnit(unit);
        const corected = listeningAnswered.filter((item) => item.isDone).length;

        return {
          total: total.length,
          corected,
        };
      };
      const listeningData = await listeningGetData();

      if (
        !(
          listeningData.corected >=
          (unitDetail?.quantityListeningAnswerRequired > 0
            ? unitDetail.quantityListeningAnswerRequired
            : listeningData.total)
        )
      ) {
        return resolve(false);
      }

      const maximunUnit = await this.getMaxUnit();
      if (!(user.currentUnit >= maximunUnit)) {
        resolve(true);
      }
      resolve(false);
    });
  };
}

export default UnitService;
